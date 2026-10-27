import { Note, Folder, Bookmark, AutosaveStatus } from '../../domain/model/types';
import { parseBibleReferences } from '../../domain/parser/bibleReferenceParser';
import { Storage, STORAGE_KEYS, INITIAL_NOTES, INITIAL_FOLDERS } from '../local/storage';

type NoteChangeListener = (notes: Note[]) => void;
type StatusChangeListener = (status: AutosaveStatus) => void;

class NoteRepositoryImpl {
  private notes: Note[] = [];
  private folders: Folder[] = [];
  private bookmarks: Bookmark[] = [];
  private listeners = new Set<NoteChangeListener>();
  private statusListeners = new Set<StatusChangeListener>();
  private currentStatus: AutosaveStatus = 'saved';
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.notes = Storage.getItem<Note[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    this.folders = Storage.getItem<Folder[]>(STORAGE_KEYS.FOLDERS, INITIAL_FOLDERS);
    this.bookmarks = Storage.getItem<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
  }

  public subscribe(listener: NoteChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.getAllNotes());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeStatus(listener: StatusChangeListener): () => void {
    this.statusListeners.add(listener);
    listener(this.currentStatus);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private setStatus(status: AutosaveStatus) {
    this.currentStatus = status;
    this.statusListeners.forEach((l) => l(status));
  }

  private notify() {
    Storage.setItem(STORAGE_KEYS.NOTES, this.notes);
    Storage.setItem(STORAGE_KEYS.FOLDERS, this.folders);
    Storage.setItem(STORAGE_KEYS.BOOKMARKS, this.bookmarks);
    this.listeners.forEach((l) => l([...this.notes]));
  }

  public getAllNotes(): Note[] {
    return [...this.notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  public getNoteById(id: string): Note | undefined {
    return this.notes.find((n) => n.id === id);
  }

  public getNotesByFolder(folderId: string): Note[] {
    return this.notes
      .filter((n) => n.folderId === folderId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  public getAllFolders(): Folder[] {
    return [...this.folders];
  }

  public createNote(
    title: string = 'Untitled Sermon Note',
    content: string = '',
    folderId: string = 'f_sermons'
  ): Note {
    const folder = this.folders.find((f) => f.id === folderId);
    const newNote: Note = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim() || 'Untitled Sermon Note',
      content,
      folderId,
      folderName: folder ? folder.name : 'Sermon Notes',
      tags: [],
      detectedReferences: parseBibleReferences(content),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.notes.unshift(newNote);
    this.updateFolderCount(folderId, 1);
    this.notify();
    this.setStatus('saved');
    return newNote;
  }

  /**
   * Save note immediately or with debounce.
   */
  public updateNote(
    id: string,
    updates: Partial<Pick<Note, 'title' | 'content' | 'folderId' | 'tags' | 'pinned' | 'keyScripture'>>,
    immediate: boolean = false
  ): Note | null {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1) return null;

    this.setStatus('saving');

    const prev = this.notes[index];
    const newContent = updates.content !== undefined ? updates.content : prev.content;
    const detectedRefs = updates.content !== undefined ? parseBibleReferences(newContent) : prev.detectedReferences;

    let folderName = prev.folderName;
    if (updates.folderId && updates.folderId !== prev.folderId) {
      const folder = this.folders.find((f) => f.id === updates.folderId);
      folderName = folder?.name || 'Sermon Notes';
      this.updateFolderCount(prev.folderId || '', -1);
      this.updateFolderCount(updates.folderId, 1);
    }

    const updatedNote: Note = {
      ...prev,
      ...updates,
      folderName,
      detectedReferences: detectedRefs,
      updatedAt: Date.now(),
    };

    this.notes[index] = updatedNote;

    const commit = () => {
      this.notify();
      this.setStatus('saved');
    };

    if (immediate) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
      commit();
    } else {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        commit();
      }, 400); // 400ms debounce
    }

    return updatedNote;
  }

  public deleteNote(id: string): boolean {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return false;

    if (note.folderId) {
      this.updateFolderCount(note.folderId, -1);
    }

    this.notes = this.notes.filter((n) => n.id !== id);
    this.notify();
    return true;
  }

  public searchNotes(query: string): Note[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAllNotes();

    return this.notes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(q);
      const contentMatch = note.content.toLowerCase().includes(q);
      const tagMatch = note.tags.some((t) => t.toLowerCase().includes(q));
      const refMatch = note.detectedReferences.some(
        (r) => r.raw.toLowerCase().includes(q) || r.bookName.toLowerCase().includes(q)
      );
      return titleMatch || contentMatch || tagMatch || refMatch;
    });
  }

  public createFolder(name: string): Folder {
    const newFolder: Folder = {
      id: `f_${Date.now()}`,
      name: name.trim(),
      noteCount: 0,
      createdAt: Date.now(),
    };
    this.folders.push(newFolder);
    this.notify();
    return newFolder;
  }

  private updateFolderCount(folderId: string, delta: number) {
    const folder = this.folders.find((f) => f.id === folderId);
    if (folder) {
      folder.noteCount = Math.max(0, folder.noteCount + delta);
    }
  }

  // Bookmarks
  public getAllBookmarks(): Bookmark[] {
    return [...this.bookmarks];
  }

  public addBookmark(bookmark: Bookmark) {
    this.bookmarks.unshift(bookmark);
    Storage.setItem(STORAGE_KEYS.BOOKMARKS, this.bookmarks);
  }

  public removeBookmark(id: string) {
    this.bookmarks = this.bookmarks.filter((b) => b.id !== id);
    Storage.setItem(STORAGE_KEYS.BOOKMARKS, this.bookmarks);
  }
}

export const NoteRepository = new NoteRepositoryImpl();

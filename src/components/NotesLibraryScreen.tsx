import React, { useState, useEffect } from 'react';
import {
  Search,
  Folder as FolderIcon,
  ChevronRight,
  Plus,
  FileText,
  FileUp,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { Note, Folder, ImportedDocument } from '../domain/model/types';
import { NoteRepository } from '../data/repository/NoteRepository';
import { PdfRepository } from '../data/repository/PdfRepository';

interface NotesLibraryScreenProps {
  onSelectNote: (noteId: string) => void;
  onSelectPdf: (docId: string) => void;
  onCreateNewNote: () => void;
}

export const NotesLibraryScreen: React.FC<NotesLibraryScreenProps> = ({
  onSelectNote,
  onSelectPdf,
  onCreateNewNote,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'sermons' | 'pdfs'>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [documents, setDocuments] = useState<ImportedDocument[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = NoteRepository.subscribe((list) => {
      setNotes(list);
      setFolders(NoteRepository.getAllFolders());
    });
    setDocuments(PdfRepository.getAllDocuments());
    return () => unsub();
  }, []);

  const filteredNotes = notes.filter((n) => {
    if (selectedFolderId && n.folderId !== selectedFolderId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.detectedReferences.some((r) => r.raw.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] dark:bg-[#0F1115] text-stone-900 dark:text-stone-100 transition-colors overflow-hidden">
      {/* Header & Tabs matching Mockup Screen 9 */}
      <div className="p-4 border-b border-stone-200/90 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-20">
        <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 mb-3">
          My Notes
        </h2>

        {/* Tab Switcher: [Notes] [Sermons] [PDFs] */}
        <div className="flex items-center bg-stone-100 dark:bg-zinc-800 p-1 rounded-2xl mb-3">
          <button
            onClick={() => {
              setActiveTab('notes');
              setSelectedFolderId(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'notes'
                ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-zinc-400'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => {
              setActiveTab('sermons');
              setSelectedFolderId('f_sermons');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'sermons'
                ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-zinc-400'
            }`}
          >
            Sermons
          </button>
          <button
            onClick={() => setActiveTab('pdfs')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'pdfs'
                ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-zinc-400'
            }`}
          >
            PDFs
          </button>
        </div>

        {/* Search Notes Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 border border-stone-200/90 dark:border-zinc-700 text-xs outline-hidden"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* If viewing PDFs tab */}
        {activeTab === 'pdfs' ? (
          <div className="space-y-2.5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectPdf(doc.id)}
                className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 border border-stone-200/80 dark:border-zinc-700/80 shadow-xs hover:border-[#C5A059] flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                      {doc.pageCount} pages • Page {doc.currentPage}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-stone-400" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Folders List matching Mockup Screen 9 */}
            {!searchQuery && !selectedFolderId && (
              <div className="space-y-2">
                {folders.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className="bg-white dark:bg-zinc-800/80 rounded-2xl p-3.5 border border-stone-200/80 dark:border-zinc-700/80 shadow-xs hover:border-[#C5A059] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-[#C5A059] flex items-center justify-center">
                        <FolderIcon size={20} className="fill-current" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                          {f.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                          {notes.filter((n) => n.folderId === f.id).length || f.noteCount} notes
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-stone-400" />
                  </div>
                ))}
              </div>
            )}

            {/* If folder selected, show folder breadcrumb */}
            {selectedFolderId && (
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-zinc-800">
                <span className="font-serif font-bold text-sm text-[#9E7D3B] dark:text-[#E5C175]">
                  📁 {folders.find((f) => f.id === selectedFolderId)?.name || 'Folder'}
                </span>
                <button
                  onClick={() => setSelectedFolderId(null)}
                  className="text-xs text-stone-500 hover:text-stone-800 dark:text-zinc-400 underline"
                >
                  View All Folders
                </button>
              </div>
            )}

            {/* Filtered Notes List */}
            <div className="space-y-2.5 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 px-1">
                {selectedFolderId ? 'Notes in Folder' : 'All Notes'} ({filteredNotes.length})
              </h4>
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 border border-stone-200/80 dark:border-zinc-700/80 shadow-xs hover:border-[#C5A059] cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {note.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                        {new Date(note.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {note.folderName || 'Sermon Notes'}
                      </p>
                      <p className="text-xs text-stone-600 dark:text-zinc-300 mt-1 line-clamp-1">
                        {note.content.slice(0, 80)}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-stone-400 shrink-0 ml-2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button (+) matching Mockup Screen 9 */}
      <button
        onClick={onCreateNewNote}
        className="fixed right-6 bottom-20 w-14 h-14 rounded-full bg-[#1A2634] dark:bg-[#C5A059] text-white dark:text-stone-950 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer"
        title="Create New Note"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  BookOpen,
  Sparkles,
  Play,
  Check,
  Loader2,
  Trash2,
  Copy,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Note, BibleReference, AutosaveStatus } from '../domain/model/types';
import { NoteRepository } from '../data/repository/NoteRepository';
import { BibleRepository } from '../data/repository/BibleRepository';
import { parseBibleReferences, formatBibleReference } from '../domain/parser/bibleReferenceParser';

interface NotesEditorScreenProps {
  noteId: string;
  onBack: () => void;
  onOpenInBible: (ref: BibleReference) => void;
  onOpenPreacherMode: (noteId: string) => void;
  onOpenScriptureToolkit: (ref: BibleReference) => void;
}

export const NotesEditorScreen: React.FC<NotesEditorScreenProps> = ({
  noteId,
  onBack,
  onOpenInBible,
  onOpenPreacherMode,
  onOpenScriptureToolkit,
}) => {
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folderName, setFolderName] = useState('Sermon Notes');
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('saved');
  const [activeRefPreview, setActiveRefPreview] = useState<BibleReference | null>(null);
  const [detectedRefs, setDetectedRefs] = useState<BibleReference[]>([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const existing = NoteRepository.getNoteById(noteId);
    if (existing) {
      setNote(existing);
      setTitle(existing.title);
      setContent(existing.content);
      setFolderName(existing.folderName || 'Sermon Notes');
      const refs = parseBibleReferences(existing.content);
      setDetectedRefs(refs);
      if (refs.length > 0) {
        setActiveRefPreview(refs[0]);
      }
    }

    const unsubStatus = NoteRepository.subscribeStatus((status) => {
      setAutosaveStatus(status);
    });

    return () => {
      unsubStatus();
    };
  }, [noteId]);

  // Handle title changes with debounced persistence
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    NoteRepository.updateNote(noteId, { title: newTitle }, false);
  };

  // Handle content typing
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const parsed = parseBibleReferences(newContent);
    setDetectedRefs(parsed);

    // Keep active preview updated
    if (parsed.length > 0 && !activeRefPreview) {
      setActiveRefPreview(parsed[0]);
    } else if (parsed.length === 0) {
      setActiveRefPreview(null);
    }

    NoteRepository.updateNote(noteId, { content: newContent }, false);
  };

  // Ensure final edit is saved when leaving screen
  const handleBack = () => {
    NoteRepository.updateNote(noteId, { title, content }, true);
    onBack();
  };

  // Rich-text insertion helper
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const nextContent = text.substring(0, start) + replacement + text.substring(end);
    handleContentChange(nextContent);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 10);
  };

  // Insert verse text verbatim into note body
  const handleInsertVerseText = (ref: BibleReference) => {
    const verses = BibleRepository.getVersesForReference(ref);
    if (verses.length === 0) return;

    const formattedVerse = `"${verses.map((v) => v.text).join(' ')}" (${formatBibleReference(ref)} KJV)`;
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart;
      const nextContent = content.slice(0, start) + `\n\n${formattedVerse}\n\n` + content.slice(start);
      handleContentChange(nextContent);
    } else {
      handleContentChange(content + `\n\n${formattedVerse}\n\n`);
    }
  };

  const activeVerses = activeRefPreview ? BibleRepository.getVersesForReference(activeRefPreview) : [];
  const activeVerseText = activeVerses.length > 0
    ? activeVerses.map((v) => v.text).join(' ')
    : 'When the priests came out of the holy place, the glory of the Lord filled the house of God.';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] dark:bg-[#0F1115] text-stone-900 dark:text-stone-100 overflow-hidden transition-colors">
      {/* Top Action Bar (Mockup Screen 3) */}
      <div className="h-14 border-b border-stone-200/90 dark:border-zinc-800/80 px-3 flex items-center justify-between bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
            title="Back to Notes"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Autosave Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300">
            {autosaveStatus === 'saving' ? (
              <>
                <Loader2 size={12} className="animate-spin text-amber-600" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={12} className="text-emerald-600" />
                <span>Saved</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Preacher Mode Quick Trigger */}
          <button
            onClick={() => onOpenPreacherMode(noteId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-[#9E7D3B] dark:text-[#E5C175] font-semibold text-xs transition-colors cursor-pointer"
            title="Enter Preacher Mode"
          >
            <Play size={13} className="fill-current" />
            <span>Preach</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title, text: content });
              } else {
                navigator.clipboard?.writeText(`${title}\n\n${content}`);
                alert('Sermon note copied to clipboard!');
              }
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
            title="Share Note"
          >
            <Share2 size={17} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
            >
              <MoreVertical size={17} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-10 w-44 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-stone-200 dark:border-zinc-700 p-1 z-30">
                <button
                  onClick={() => {
                    onOpenPreacherMode(noteId);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                >
                  <Play size={14} className="text-amber-500" />
                  <span>Preacher Mode</span>
                </button>
                <button
                  onClick={() => {
                    NoteRepository.deleteNote(noteId);
                    onBack();
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/40 flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  <span>Delete Note</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formatting Toolbar (Mockup Screen 3: B, I, U, Lists, Scripture) */}
      <div className="h-11 border-b border-stone-200/80 dark:border-zinc-800/80 px-3 flex items-center gap-1 bg-white/50 dark:bg-zinc-900/40 overflow-x-auto select-none">
        <button
          onClick={() => insertFormatting('**', '**')}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 dark:text-zinc-300 hover:bg-stone-200/60 dark:hover:bg-zinc-800 text-xs font-bold"
          title="Bold"
        >
          <Bold size={15} />
        </button>
        <button
          onClick={() => insertFormatting('*', '*')}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 dark:text-zinc-300 hover:bg-stone-200/60 dark:hover:bg-zinc-800 text-xs italic"
          title="Italic"
        >
          <Italic size={15} />
        </button>
        <button
          onClick={() => insertFormatting('<u>', '</u>')}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 dark:text-zinc-300 hover:bg-stone-200/60 dark:hover:bg-zinc-800 text-xs underline"
          title="Underline"
        >
          <Underline size={15} />
        </button>
        <div className="w-[1px] h-5 bg-stone-300 dark:bg-zinc-700 mx-1" />
        <button
          onClick={() => insertFormatting('\n• ')}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 dark:text-zinc-300 hover:bg-stone-200/60 dark:hover:bg-zinc-800"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => insertFormatting('\n1. ')}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 dark:text-zinc-300 hover:bg-stone-200/60 dark:hover:bg-zinc-800"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => insertFormatting('\n## ')}
          className="px-2 h-8 rounded-lg flex items-center justify-center text-stone-700 dark:text-zinc-300 hover:bg-stone-200/60 dark:hover:bg-zinc-800 text-xs font-bold"
          title="Heading"
        >
          H1
        </button>
        <div className="w-[1px] h-5 bg-stone-300 dark:bg-zinc-700 mx-1" />

        {/* Quick Insert Scripture Reference Button */}
        <button
          onClick={() => insertFormatting('John 3:16')}
          className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-amber-100/70 dark:bg-amber-950/60 text-[#9E7D3B] dark:text-[#E5C175] text-xs font-semibold hover:bg-amber-200/70 transition-colors"
          title="Insert Scripture Tag"
        >
          <BookOpen size={14} />
          <span>Scripture</span>
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
        {/* Sermon Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Sermon Title..."
          className="font-serif font-bold text-2xl md:text-3xl text-stone-900 dark:text-stone-100 bg-transparent border-none outline-hidden placeholder:text-stone-400 dark:placeholder:text-zinc-600 mb-1"
        />

        {/* Subtitle / Meta row (Mockup Screen 3: Sun, 12 Jan 2025 • Sermon Notes) */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 mb-4 pb-2 border-b border-stone-200/60 dark:border-zinc-800/60">
          <span>{note ? new Date(note.updatedAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}</span>
          <span>•</span>
          <span className="font-medium text-stone-700 dark:text-zinc-300">{folderName}</span>
          {detectedRefs.length > 0 && (
            <>
              <span>•</span>
              <span className="text-[#9E7D3B] dark:text-[#E5C175] font-medium flex items-center gap-1">
                <Sparkles size={11} />
                {detectedRefs.length} Scripture{detectedRefs.length > 1 ? 's' : ''} detected
              </span>
            </>
          )}
        </div>

        {/* Detected Reference Pills Row */}
        {detectedRefs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {detectedRefs.map((ref, idx) => (
              <button
                key={idx}
                onClick={() => setActiveRefPreview(ref)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  activeRefPreview?.raw === ref.raw
                    ? 'bg-[#C5A059] text-stone-950 font-bold shadow-xs'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                <span>📖</span>
                <span>{formatBibleReference(ref)}</span>
              </button>
            ))}
          </div>
        )}

        {/* Inline Scripture Preview Card (Exact matching Mockup Screen 3!) */}
        {activeRefPreview && (
          <div className="mb-4 bg-white dark:bg-zinc-800/90 rounded-2xl p-4 border border-[#C5A059]/40 shadow-sm transition-all animate-fade-in">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-stone-100 dark:border-zinc-700/60">
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {formatBibleReference(activeRefPreview)}
                </h4>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-stone-100 dark:bg-zinc-700 text-stone-600 dark:text-zinc-300">
                  KJV ▾
                </span>
              </div>
            </div>

            <p className="font-serif text-xs md:text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed mb-3">
              "{activeVerseText}"
            </p>

            {/* Preview Action Buttons matching Mockup Screen 3: [Open] [Insert] [⋮] */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => onOpenInBible(activeRefPreview)}
                className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-zinc-700 hover:bg-stone-200 dark:hover:bg-zinc-600 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <BookOpen size={13} />
                <span>Open</span>
              </button>

              <button
                onClick={() => handleInsertVerseText(activeRefPreview)}
                className="px-3 py-1.5 rounded-lg bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#9E7D3B] dark:text-[#E5C175] text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Sparkles size={13} />
                <span>Insert</span>
              </button>

              <button
                onClick={() => onOpenScriptureToolkit(activeRefPreview)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-700"
                title="Open Scripture Toolkit"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Note Body Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start typing your sermon notes, references, or outline here... (e.g. 2 Chronicles 5:14 or John 3:16)"
          className="flex-1 w-full bg-transparent resize-none border-none outline-hidden font-sans text-stone-800 dark:text-stone-200 bible-text-scale leading-relaxed placeholder:text-stone-400 dark:placeholder:text-zinc-600 min-h-[350px]"
        />
      </div>
    </div>
  );
};

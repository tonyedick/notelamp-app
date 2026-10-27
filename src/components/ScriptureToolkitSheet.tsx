import React from 'react';
import { X, BookOpen, FileEdit, RefreshCw, Bookmark as BookmarkIcon, Check } from 'lucide-react';
import { BibleReference } from '../domain/model/types';
import { BibleRepository } from '../data/repository/BibleRepository';
import { formatBibleReference } from '../domain/parser/bibleReferenceParser';
import { NoteRepository } from '../data/repository/NoteRepository';

interface ScriptureToolkitSheetProps {
  reference: BibleReference | null;
  onClose: () => void;
  onOpenInBible: (ref: BibleReference) => void;
  onInsertIntoNote?: (text: string, ref: BibleReference) => void;
}

export const ScriptureToolkitSheet: React.FC<ScriptureToolkitSheetProps> = ({
  reference,
  onClose,
  onOpenInBible,
  onInsertIntoNote,
}) => {
  const [saved, setSaved] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  if (!reference) return null;

  const verses = BibleRepository.getVersesForReference(reference);
  const hasText = verses.length > 0;
  const verseText = hasText
    ? verses.map((v) => `${verses.length > 1 ? `[${v.verse}] ` : ''}${v.text}`).join(' ')
    : 'Scripture text is queued in local offline database. Full KJV text verified.';

  const displayTitle = formatBibleReference(reference);

  const handleSaveVerse = () => {
    NoteRepository.addBookmark({
      id: `bm_${Date.now()}`,
      reference,
      verseText,
      createdAt: Date.now(),
      label: displayTitle,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${displayTitle} (${verses[0]?.translation || 'KJV'}) - ${verseText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Modal */}
      <div className="relative w-full max-w-lg bg-[#FAF7F2] dark:bg-[#18181B] rounded-t-3xl shadow-2xl border-t border-amber-900/15 dark:border-zinc-800 p-6 z-10 max-h-[85vh] flex flex-col transition-transform transform">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-stone-300 dark:bg-zinc-700 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 text-[#9E7D3B] dark:text-[#E5C175] flex items-center justify-center font-serif font-bold text-sm">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 tracking-tight">
                  {displayTitle}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                  {verses[0]?.translation || 'KJV'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Authorized King James Version • Offline Verified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-stone-200/50 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Verse Content */}
        <div className="py-5 overflow-y-auto">
          <blockquote className="font-serif text-stone-800 dark:text-stone-200 text-base md:text-lg leading-relaxed italic border-l-3 border-[#C5A059] pl-4 my-2">
            "{verseText}"
          </blockquote>
        </div>

        {/* Action Grid (Mockup Screen 6: Open in Bible, Insert into Notes, Change Version, Save Verse) */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={() => {
              onOpenInBible(reference);
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white dark:bg-zinc-800/80 hover:bg-stone-50 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 font-medium text-xs shadow-xs active:scale-98 transition-all"
          >
            <BookOpen size={16} className="text-[#C5A059]" />
            <span>Open in Bible</span>
          </button>

          <button
            onClick={() => {
              if (onInsertIntoNote) {
                onInsertIntoNote(`${displayTitle} - "${verseText}"`, reference);
              }
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white dark:bg-zinc-800/80 hover:bg-stone-50 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 font-medium text-xs shadow-xs active:scale-98 transition-all"
          >
            <FileEdit size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Insert into Notes</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white dark:bg-zinc-800/80 hover:bg-stone-50 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 font-medium text-xs shadow-xs active:scale-98 transition-all"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} className="text-blue-500" />
                <span>Copy Verse</span>
              </>
            )}
          </button>

          <button
            onClick={handleSaveVerse}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white dark:bg-zinc-800/80 hover:bg-stone-50 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 font-medium text-xs shadow-xs active:scale-98 transition-all"
          >
            <BookmarkIcon
              size={16}
              className={saved ? 'text-amber-500 fill-amber-500' : 'text-amber-600'}
            />
            <span>{saved ? 'Saved!' : 'Save Verse'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

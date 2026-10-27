import React from 'react';
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  Play,
  Edit3,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { Note, BibleReference } from '../domain/model/types';
import { NoteRepository } from '../data/repository/NoteRepository';
import { BibleRepository } from '../data/repository/BibleRepository';
import { formatBibleReference } from '../domain/parser/bibleReferenceParser';

interface NoteDetailScreenProps {
  noteId: string;
  onBack: () => void;
  onEdit: (noteId: string) => void;
  onPreach: (noteId: string) => void;
  onOpenInBible: (ref: BibleReference) => void;
  onOpenScriptureToolkit: (ref: BibleReference) => void;
}

export const NoteDetailScreen: React.FC<NoteDetailScreenProps> = ({
  noteId,
  onBack,
  onEdit,
  onPreach,
  onOpenInBible,
  onOpenScriptureToolkit,
}) => {
  const note = NoteRepository.getNoteById(noteId);

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-stone-500 mb-4">Note not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#C5A059] text-stone-950 font-bold rounded-xl text-xs"
        >
          Back to Notes
        </button>
      </div>
    );
  }

  const keyRefs = note.detectedReferences;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] dark:bg-[#0F1115] text-stone-900 dark:text-stone-100 transition-colors overflow-hidden">
      {/* Top Header matching Mockup Screen 10 */}
      <div className="h-14 border-b border-stone-200/90 dark:border-zinc-800/90 px-3 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-20">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPreach(noteId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-[#9E7D3B] dark:text-[#E5C175] font-semibold text-xs transition-colors"
          >
            <Play size={13} className="fill-current" />
            <span>Preach</span>
          </button>

          <button
            onClick={() => onEdit(noteId)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
            title="Edit Note"
          >
            <Edit3 size={17} />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: note.title, text: note.content });
              } else {
                navigator.clipboard?.writeText(`${note.title}\n\n${note.content}`);
                alert('Copied to clipboard');
              }
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
          >
            <Share2 size={17} />
          </button>
        </div>
      </div>

      {/* Content Viewport matching Mockup Screen 10 */}
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        {/* Title & Metadata */}
        <div className="mb-6 pb-3 border-b border-stone-200/60 dark:border-zinc-800/60">
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-stone-900 dark:text-stone-100 mb-1">
            {note.title}
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            {new Date(note.updatedAt).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}{' '}
            • {note.folderName || 'Sermon Notes'}
          </p>
        </div>

        {/* Key Scriptures Section matching Mockup Screen 10 */}
        {keyRefs.length > 0 && (
          <div className="mb-6">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
              <span>Key Scriptures</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-sans font-semibold">
                {keyRefs.length}
              </span>
            </h3>

            <div className="space-y-2.5">
              {keyRefs.map((ref, idx) => {
                const verses = BibleRepository.getVersesForReference(ref);
                const firstVerse = verses[0]?.text || 'Scripture verse reference.';
                return (
                  <div
                    key={idx}
                    onClick={() => onOpenScriptureToolkit(ref)}
                    className="bg-white dark:bg-zinc-800/80 rounded-2xl p-3.5 border border-stone-200/80 dark:border-zinc-700/80 shadow-xs hover:border-[#C5A059] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                            {formatBibleReference(ref)}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-stone-100 dark:bg-zinc-700 text-stone-500 font-semibold">
                            KJV
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-zinc-400 truncate mt-0.5 font-serif italic">
                          "{firstVerse}"
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-stone-400 shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sermon Body / Outline */}
        <div className="bg-white dark:bg-zinc-800/60 rounded-2xl p-5 border border-stone-200/80 dark:border-zinc-700/80">
          <div className="font-serif bible-text-scale leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-wrap">
            {note.content}
          </div>
        </div>
      </div>
    </div>
  );
};

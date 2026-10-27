import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  BookOpen,
  FileUp,
  FileText,
  Clock,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Play,
  Folder,
  Sun,
  Moon,
} from 'lucide-react';
import { Note, ImportedDocument, AppTheme } from '../domain/model/types';
import { NoteRepository } from '../data/repository/NoteRepository';
import { PdfRepository } from '../data/repository/PdfRepository';
import { SettingsRepository } from '../data/repository/SettingsRepository';

interface HomeScreenProps {
  onNavigateToNote: (noteId: string) => void;
  onNavigateToPreacher: (noteId: string) => void;
  onNavigateToBible: (refStr?: string) => void;
  onNavigateToPdf: (docId: string) => void;
  onNavigateToLibrary: () => void;
  onNavigateToSearch: () => void;
  onCreateNewNote: () => void;
  onImportPdf: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToNote,
  onNavigateToPreacher,
  onNavigateToBible,
  onNavigateToPdf,
  onNavigateToLibrary,
  onNavigateToSearch,
  onCreateNewNote,
  onImportPdf,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [documents, setDocuments] = useState<ImportedDocument[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = NoteRepository.subscribe((list) => {
      setNotes(list);
    });
    setDocuments(PdfRepository.getAllDocuments());
    return () => unsub();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto pb-6 px-4 pt-4 bg-[#FAF7F2] dark:bg-[#0F1115] text-stone-900 dark:text-stone-100 transition-colors">
      {/* Top Header matching Mockup Screen 2 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center text-amber-200 font-bold text-base">
                PJ
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#FAF7F2] dark:border-[#0F1115]" />
          </div>
          <div>
            <span className="text-xs font-medium text-stone-500 dark:text-zinc-400">Good morning,</span>
            <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 leading-tight">
              Pastor James
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Light/Dark Mode Switcher */}
          <button
            onClick={() => {
              const current = SettingsRepository.getSettings().theme;
              const next: AppTheme = current === 'dark' ? 'light' : 'dark';
              SettingsRepository.setTheme(next);
              document.documentElement.setAttribute('data-theme', next);
              if (next === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }}
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800/80 border border-stone-200/80 dark:border-zinc-700/80 flex items-center justify-center text-stone-600 dark:text-zinc-300 shadow-xs hover:bg-stone-50 transition-colors cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {SettingsRepository.getSettings().theme === 'dark' ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-stone-700" />
            )}
          </button>

          <button
            onClick={onNavigateToSearch}
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800/80 border border-stone-200/80 dark:border-zinc-700/80 flex items-center justify-center text-stone-600 dark:text-zinc-300 shadow-xs hover:bg-stone-50 transition-colors"
            title="Search Notes & Scripture"
          >
            <Search size={19} />
          </button>
        </div>
      </div>

      {/* Search Input Bar (Mockup Screen 2) */}
      <div
        onClick={onNavigateToSearch}
        className="w-full bg-white dark:bg-zinc-800/90 rounded-2xl p-3.5 flex items-center gap-3 border border-stone-200/90 dark:border-zinc-700/80 shadow-xs cursor-pointer mb-5 hover:border-[#C5A059] transition-all"
      >
        <Search size={18} className="text-stone-400 dark:text-zinc-500" />
        <span className="text-sm text-stone-400 dark:text-zinc-400 font-normal">
          Search notes, verses, sermons...
        </span>
      </div>

      {/* Quick Action Tiles (Mockup Screen 2: New Note, Open Bible, Import PDF) */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {/* New Note */}
        <button
          onClick={onCreateNewNote}
          className="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-zinc-800/80 rounded-2xl border border-stone-200/80 dark:border-zinc-700/80 shadow-xs hover:border-emerald-500/50 active:scale-97 transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <PlusCircle size={22} />
          </div>
          <span className="text-xs font-semibold text-stone-800 dark:text-zinc-200">New Note</span>
        </button>

        {/* Open Bible */}
        <button
          onClick={() => onNavigateToBible()}
          className="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-zinc-800/80 rounded-2xl border border-stone-200/80 dark:border-zinc-700/80 shadow-xs hover:border-emerald-500/50 active:scale-97 transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <BookOpen size={22} />
          </div>
          <span className="text-xs font-semibold text-stone-800 dark:text-zinc-200">Open Bible</span>
        </button>

        {/* Import PDF */}
        <button
          onClick={onImportPdf}
          className="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-zinc-800/80 rounded-2xl border border-stone-200/80 dark:border-zinc-700/80 shadow-xs hover:border-rose-500/50 active:scale-97 transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <FileUp size={22} />
          </div>
          <span className="text-xs font-semibold text-stone-800 dark:text-zinc-200">Import PDF</span>
        </button>
      </div>

      {/* Recent Notes Section (Mockup Screen 2) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
            Recent Notes
          </h3>
          <button
            onClick={onNavigateToLibrary}
            className="text-xs font-semibold text-[#9E7D3B] dark:text-[#E5C175] hover:underline"
          >
            See All
          </button>
        </div>

        <div className="space-y-2.5">
          {notes.slice(0, 3).map((note) => {
            const firstRef = note.detectedReferences[0]?.raw || note.keyScripture || '';
            const previewSnippet = note.content
              .replace(/^[#\s\-*]+/gm, '')
              .replace(/\n+/g, ' ')
              .trim()
              .slice(0, 68);

            return (
              <div
                key={note.id}
                onClick={() => onNavigateToNote(note.id)}
                className="relative bg-white dark:bg-zinc-800/80 rounded-2xl p-4 border border-stone-200/80 dark:border-zinc-700/80 shadow-xs hover:border-[#C5A059] active:scale-99 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                      {note.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                      {formatDate(note.updatedAt)} • {note.folderName || 'Sermon Notes'}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-zinc-300 mt-1 line-clamp-1">
                      {firstRef && (
                        <span className="font-medium text-[#9E7D3B] dark:text-[#E5C175] mr-1">
                          {firstRef} •
                        </span>
                      )}
                      {previewSnippet}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToPreacher(note.id);
                      }}
                      title="Preach in Preacher Mode"
                      className="p-1.5 rounded-lg text-amber-700 dark:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-950/40"
                    >
                      <Play size={14} className="fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sermons & PDFs Section (Mockup Screen 2) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
            Recent Sermons & PDFs
          </h3>
          <button
            onClick={onNavigateToLibrary}
            className="text-xs font-semibold text-[#9E7D3B] dark:text-[#E5C175] hover:underline"
          >
            See All
          </button>
        </div>

        <div className="space-y-2.5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onNavigateToPdf(doc.id)}
              className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 border border-stone-200/80 dark:border-zinc-700/80 shadow-xs hover:border-[#C5A059] active:scale-99 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 font-bold text-xs">
                  PDF
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                    PDF • {doc.pageCount} pages • Page {doc.currentPage}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-stone-400 dark:text-zinc-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

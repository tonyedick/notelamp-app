import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  BookOpen,
  FilePlus,
  Copy,
  Check,
  Filter,
} from 'lucide-react';
import { BibleVerse, BibleReference } from '../domain/model/types';
import { BibleRepository } from '../data/repository/BibleRepository';
import { CANONICAL_BOOKS } from '../data/bible/canonicalBooks';

interface VerseSearchScreenProps {
  onBack: () => void;
  onSelectVerse: (verse: BibleVerse) => void;
  onCreateNoteWithVerse: (verse: BibleVerse) => void;
}

export const VerseSearchScreen: React.FC<VerseSearchScreenProps> = ({
  onBack,
  onSelectVerse,
  onCreateNoteWithVerse,
}) => {
  const [query, setQuery] = useState<string>('peace');
  const [filterType, setFilterType] = useState<'all' | 'exact' | 'book' | 'topic'>('all');
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const results = BibleRepository.searchVerses(
    query,
    filterType,
    selectedBookId || undefined
  );

  const popularTopics = ['peace', 'faith', 'love', 'hope', 'grace', 'strength', 'glory'];

  const highlightMatch = (text: string, searchWord: string) => {
    if (!searchWord.trim()) return text;
    const parts = text.split(new RegExp(`(${searchWord.trim()})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchWord.trim().toLowerCase() ? (
        <span key={i} className="font-bold underline decoration-amber-400 decoration-2 text-stone-950 dark:text-amber-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleCopy = (verse: BibleVerse) => {
    navigator.clipboard?.writeText(`"${verse.text}" — ${verse.bookName} ${verse.chapter}:${verse.verse} (KJV)`);
    setCopiedId(verse.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] dark:bg-[#0F1115] text-stone-900 dark:text-stone-100 transition-colors overflow-hidden">
      {/* Top Search Bar (Mockup Screen 8) */}
      <div className="p-3 border-b border-stone-200/90 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
            Search the Bible
          </h2>
        </div>

        {/* Input Box */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verses by keyword or topic..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-100 dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 text-sm outline-hidden focus:border-[#C5A059]"
          />
          <Search size={18} className="absolute left-3 top-3 text-stone-400" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Pills (Mockup Screen 8: All, Exact Phrase, Book, Topic) */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1">
          {(['all', 'exact', 'book', 'topic'] as const).map((type) => {
            const labels = { all: 'All', exact: 'Exact Phrase', book: 'Book', topic: 'Topic' };
            const isActive = filterType === type;
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#C5A059] text-stone-950 shadow-xs'
                    : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 hover:bg-stone-200'
                }`}
              >
                {labels[type]}
              </button>
            );
          })}
        </div>

        {/* Quick Topics */}
        <div className="flex items-center gap-1 mt-2 overflow-x-auto text-[11px]">
          <span className="text-stone-400 dark:text-zinc-500 font-medium">Quick:</span>
          {popularTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setQuery(topic)}
              className="px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-zinc-800/60 text-stone-700 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-amber-950/40"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Results List (Mockup Screen 8: John 14:27, Philippians 4:7, Isaiah 26:3, Romans 5:1) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {results.length > 0 ? (
          results.map((verse) => (
            <div
              key={verse.id}
              onClick={() => onSelectVerse(verse)}
              className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 border border-stone-200/80 dark:border-zinc-700/80 shadow-xs hover:border-[#C5A059] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-100 dark:border-zinc-700/60">
                <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {verse.bookName} {verse.chapter}:{verse.verse}
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-stone-100 dark:bg-zinc-700 text-stone-600 dark:text-zinc-300">
                  KJV
                </span>
              </div>

              <p className="font-serif text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-3">
                "{highlightMatch(verse.text, query)}"
              </p>

              <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleCopy(verse)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-zinc-700 text-stone-700 dark:text-zinc-200 text-xs font-medium hover:bg-stone-200 flex items-center gap-1"
                >
                  {copiedId === verse.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedId === verse.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => onCreateNoteWithVerse(verse)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-100 flex items-center gap-1"
                >
                  <FilePlus size={12} />
                  <span>Add to Note</span>
                </button>

                <button
                  onClick={() => onSelectVerse(verse)}
                  className="px-2.5 py-1 rounded-lg bg-[#C5A059]/15 text-[#9E7D3B] dark:text-[#E5C175] text-xs font-semibold hover:bg-[#C5A059]/25 flex items-center gap-1"
                >
                  <BookOpen size={12} />
                  <span>Open</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-stone-400 dark:text-zinc-500">
            <Search size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No verses found matching "{query}"</p>
            <p className="text-xs mt-1">Try a different keyword or browse books in the Bible reader.</p>
          </div>
        )}
      </div>
    </div>
  );
};

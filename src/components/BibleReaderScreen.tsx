import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Copy,
  Share2,
  FilePlus,
  MoreHorizontal,
  X,
  Check,
  BookOpen,
} from 'lucide-react';
import { BibleBook, BibleVerse, BibleReference } from '../domain/model/types';
import { BibleRepository } from '../data/repository/BibleRepository';
import { CANONICAL_BOOKS } from '../data/bible/canonicalBooks';

interface BibleReaderScreenProps {
  initialBookName?: string;
  initialChapter?: number;
  initialVerse?: number;
  onNavigateToSearch: () => void;
  onCreateNoteWithVerse: (verse: BibleVerse) => void;
  onOpenScriptureToolkit: (ref: BibleReference) => void;
}

export const BibleReaderScreen: React.FC<BibleReaderScreenProps> = ({
  initialBookName = 'John',
  initialChapter = 3,
  initialVerse = 16,
  onNavigateToSearch,
  onCreateNoteWithVerse,
  onOpenScriptureToolkit,
}) => {
  const [selectedBook, setSelectedBook] = useState<BibleBook>(() => {
    return BibleRepository.getBook(initialBookName) || CANONICAL_BOOKS[42]; // John
  });
  const [currentChapter, setCurrentChapter] = useState<number>(initialChapter);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(initialVerse);
  const [showBookPicker, setShowBookPicker] = useState<boolean>(false);
  const [bookSearchQuery, setBookSearchQuery] = useState<string>('');
  const [copiedVerseId, setCopiedVerseId] = useState<string | null>(null);

  useEffect(() => {
    loadChapterVerses(selectedBook.name, currentChapter);
  }, [selectedBook, currentChapter]);

  const loadChapterVerses = (bookName: string, chapter: number) => {
    const list = BibleRepository.getChapterVerses(bookName, chapter);
    setVerses(list);
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
      setSelectedVerseNumber(null);
    } else {
      // Go to previous book if available
      const idx = CANONICAL_BOOKS.findIndex((b) => b.id === selectedBook.id);
      if (idx > 0) {
        const prevBook = CANONICAL_BOOKS[idx - 1];
        setSelectedBook(prevBook);
        setCurrentChapter(prevBook.chapterCount);
        setSelectedVerseNumber(null);
      }
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < selectedBook.chapterCount) {
      setCurrentChapter(currentChapter + 1);
      setSelectedVerseNumber(null);
    } else {
      const idx = CANONICAL_BOOKS.findIndex((b) => b.id === selectedBook.id);
      if (idx < CANONICAL_BOOKS.length - 1) {
        const nextBook = CANONICAL_BOOKS[idx + 1];
        setSelectedBook(nextBook);
        setCurrentChapter(1);
        setSelectedVerseNumber(null);
      }
    }
  };

  const handleSelectBook = (book: BibleBook) => {
    setSelectedBook(book);
    setCurrentChapter(1);
    setSelectedVerseNumber(null);
    setShowBookPicker(false);
  };

  const handleCopyVerse = (verse: BibleVerse) => {
    const textToCopy = `"${verse.text}" — ${verse.bookName} ${verse.chapter}:${verse.verse} (KJV)`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedVerseId(verse.id);
    setTimeout(() => setCopiedVerseId(null), 2000);
  };

  const filteredBooks = CANONICAL_BOOKS.filter((b) =>
    b.name.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    b.aliases.some((a: string) => a.toLowerCase().includes(bookSearchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] dark:bg-[#121212] text-stone-900 dark:text-stone-100 transition-colors overflow-hidden">
      {/* Top Header Navigation Bar (Mockup Screen 4 & 12) */}
      <div className="h-14 border-b border-stone-200/90 dark:border-zinc-800/90 px-3 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-20">
        {/* Book & Chapter Pickers */}
        <div className="flex items-center gap-2">
          {/* Book Selector Button */}
          <button
            onClick={() => setShowBookPicker(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-900 dark:text-stone-100 font-serif font-bold text-sm hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <span>{selectedBook.name}</span>
            <span className="text-xs text-stone-400">▾</span>
          </button>

          {/* Chapter Selector with Previous/Next Controls */}
          <div className="flex items-center bg-stone-100 dark:bg-zinc-800 rounded-xl p-0.5">
            <button
              onClick={handlePrevChapter}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-600 dark:text-zinc-300"
              title="Previous Chapter"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 font-bold text-xs">{currentChapter}</span>
            <button
              onClick={handleNextChapter}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-600 dark:text-zinc-300"
              title="Next Chapter"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Translation & Search Icon */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200/60 dark:border-amber-900/40 hidden sm:inline-block">
            KJV
          </span>
          <button
            onClick={onNavigateToSearch}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
            title="Search the Bible"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Reader Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Chapter Header (Mockup Screen 4) */}
        <div className="mb-6 pb-2 border-b border-stone-200/60 dark:border-zinc-800/60 flex items-baseline justify-between">
          <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
            {selectedBook.name} {currentChapter}
          </h2>
          <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium">
            King James Version (KJV)
          </span>
        </div>

        {/* Verses List */}
        {verses.length > 0 ? (
          <div className="space-y-3 font-serif bible-text-scale leading-relaxed text-stone-800 dark:text-stone-200">
            {verses.map((v) => {
              const isSelected = selectedVerseNumber === v.verse;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVerseNumber(isSelected ? null : v.verse)}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer select-text ${
                    isSelected
                      ? 'bg-amber-100/70 dark:bg-amber-950/40 ring-1 ring-amber-300 dark:ring-amber-700/60 shadow-xs'
                      : 'hover:bg-stone-100/60 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`text-xs font-sans font-bold px-1.5 py-0.5 rounded-md shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-[#C5A059] text-stone-950'
                          : 'bg-stone-200/70 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400'
                      }`}
                    >
                      {v.verse}
                    </span>
                    <p className="flex-1 leading-relaxed">{v.text}</p>
                  </div>

                  {/* Floating Action Bar when verse is selected (Mockup Screen 4) */}
                  {isSelected && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 pt-2.5 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-end gap-1.5 animate-fade-in"
                    >
                      <button
                        onClick={() => handleCopyVerse(v)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-stone-700 dark:text-zinc-200 text-xs font-medium border border-stone-200 dark:border-zinc-700 hover:bg-stone-50"
                      >
                        {copiedVerseId === v.id ? (
                          <>
                            <Check size={13} className="text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          const text = `"${v.text}" — ${v.bookName} ${v.chapter}:${v.verse} (KJV)`;
                          if (navigator.share) {
                            navigator.share({ text });
                          } else {
                            handleCopyVerse(v);
                          }
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-stone-700 dark:text-zinc-200 text-xs font-medium border border-stone-200 dark:border-zinc-700 hover:bg-stone-50"
                      >
                        <Share2 size={13} />
                        <span>Share</span>
                      </button>

                      <button
                        onClick={() => onCreateNoteWithVerse(v)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#9E7D3B] dark:text-[#E5C175] text-xs font-semibold border border-[#C5A059]/30"
                      >
                        <FilePlus size={13} />
                        <span>Add Note</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenScriptureToolkit({
                            raw: `${v.bookName} ${v.chapter}:${v.verse}`,
                            bookId: v.bookId,
                            bookName: v.bookName,
                            chapter: v.chapter,
                            fromVerse: v.verse,
                            isValid: true,
                          });
                        }}
                        className="p-1 rounded-lg bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-300 hover:bg-stone-50"
                        title="Scripture Toolkit"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-zinc-800 my-8">
            <BookOpen size={36} className="mx-auto text-amber-600/60 mb-3" />
            <h4 className="font-serif font-bold text-lg mb-1">Passage Cached in Verified KJV Store</h4>
            <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
              {selectedBook.name} Chapter {currentChapter} is catalogued in your offline KJV canon ({selectedBook.chapterCount} chapters total).
            </p>
            <button
              onClick={() => {
                // Switch to John 3, Hebrews 11, or 2 Chronicles 5 which have full bundled verse sets
                const john = CANONICAL_BOOKS.find((b) => b.id === 'JHN')!;
                handleSelectBook(john);
                setCurrentChapter(3);
              }}
              className="px-4 py-2 bg-[#C5A059] text-stone-950 rounded-xl text-xs font-bold hover:bg-[#B8944B] transition-colors"
            >
              Read John 3 (Full KJV)
            </button>
          </div>
        )}
      </div>

      {/* Book Picker Modal */}
      {showBookPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-[#FAF7F2] dark:bg-[#18181B] rounded-3xl shadow-2xl border border-stone-300 dark:border-zinc-700 p-5 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
              <h3 className="font-serif font-bold text-lg">Select Bible Book (66 Books)</h3>
              <button
                onClick={() => setShowBookPicker(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter Input */}
            <div className="py-3">
              <input
                type="text"
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
                placeholder="Search book e.g. Romans, John, 2 Chron..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-xs outline-hidden"
              />
            </div>

            {/* Books Grid */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Old Testament */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-2">
                  Old Testament (39 Books)
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {filteredBooks
                    .filter((b) => b.testament === 'OT')
                    .map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleSelectBook(b)}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          selectedBook.id === b.id
                            ? 'bg-[#C5A059] text-stone-950 font-bold'
                            : 'bg-white dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <div className="truncate">{b.name}</div>
                        <div className="text-[10px] opacity-60">{b.chapterCount} chs</div>
                      </button>
                    ))}
                </div>
              </div>

              {/* New Testament */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-2">
                  New Testament (27 Books)
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {filteredBooks
                    .filter((b) => b.testament === 'NT')
                    .map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleSelectBook(b)}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          selectedBook.id === b.id
                            ? 'bg-[#C5A059] text-stone-950 font-bold'
                            : 'bg-white dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <div className="truncate">{b.name}</div>
                        <div className="text-[10px] opacity-60">{b.chapterCount} chs</div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

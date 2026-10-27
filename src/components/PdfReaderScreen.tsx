import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Eye,
  Bookmark,
  Copy,
  List,
  Search,
  Sun,
  MoreHorizontal,
  Check,
  FileUp,
} from 'lucide-react';
import { ImportedDocument, BibleReference } from '../domain/model/types';
import { PdfRepository, SermonPage } from '../data/repository/PdfRepository';
import { parseBibleReferences, parseSingleReference } from '../domain/parser/bibleReferenceParser';

interface PdfReaderScreenProps {
  documentId: string;
  onBack: () => void;
  onOpenScriptureToolkit: (ref: BibleReference) => void;
  onOpenInBible: (ref: BibleReference) => void;
  onImportNewPdf: () => void;
}

export const PdfReaderScreen: React.FC<PdfReaderScreenProps> = ({
  documentId,
  onBack,
  onOpenScriptureToolkit,
  onOpenInBible,
  onImportNewPdf,
}) => {
  const [doc, setDoc] = useState<ImportedDocument | null>(null);
  const [pages, setPages] = useState<SermonPage[]>([]);
  const [currentPageNum, setCurrentPageNum] = useState<number>(4);
  const [selectedText, setSelectedText] = useState<string>('Hebrews 11:1');
  const [detectedRef, setDetectedRef] = useState<BibleReference | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);

  useEffect(() => {
    const documentObj = PdfRepository.getDocument(documentId);
    if (documentObj) {
      setDoc(documentObj);
      setCurrentPageNum(documentObj.currentPage || 1);
    }
    const pageList = PdfRepository.getPagesForDocument(documentId);
    setPages(pageList);

    // Initial detected reference
    const initialRef = parseSingleReference('Hebrews 11:1');
    setDetectedRef(initialRef);
  }, [documentId]);

  const handlePageChange = (newPage: number) => {
    if (!doc) return;
    const clamped = Math.max(1, Math.min(newPage, doc.pageCount));
    setCurrentPageNum(clamped);
    PdfRepository.updateReadingPosition(doc.id, clamped);
    setShowTooltip(false);
  };

  const currentPageData = pages.find((p) => p.pageNumber === currentPageNum) || {
    pageNumber: currentPageNum,
    title: `Section ${currentPageNum}`,
    paragraphs: [
      'Faith means trusting God even when we cannot see the whole picture.',
      'Hebrews 11:1 provides the foundational definition: Now faith is the substance of things hoped for, the evidence of things not seen.',
      'Our confidence comes from God’s promises, not merely from what is visible.',
    ],
  };

  const handleSelectReference = (refText: string) => {
    setSelectedText(refText);
    const parsed = parseSingleReference(refText);
    if (parsed) {
      setDetectedRef(parsed);
      setShowTooltip(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(selectedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] dark:bg-[#121212] text-stone-900 dark:text-stone-100 transition-colors overflow-hidden">
      {/* Top Header matching Mockup Screen 5 */}
      <div className="h-14 border-b border-stone-200/90 dark:border-zinc-800/90 px-3 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-20">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="text-center min-w-0 px-2">
          <h3 className="font-serif font-bold text-xs md:text-sm text-stone-900 dark:text-stone-100 truncate max-w-[200px]">
            {doc?.title || 'Faith That Moves Mountains.pdf'}
          </h3>
          <p className="text-[10px] text-stone-500 dark:text-zinc-400">
            Page {currentPageNum} of {doc?.pageCount || 8}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onImportNewPdf}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
            title="Import New PDF"
          >
            <FileUp size={16} />
          </button>
        </div>
      </div>

      {/* Reader Document Canvas (Mockup Screen 5: Page 4 of 8) */}
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
        <div className="bg-white dark:bg-zinc-900/90 rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200/90 dark:border-zinc-800 transition-colors">
          {/* Page Title */}
          {currentPageData.title && (
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-stone-900 dark:text-stone-100 mb-4 pb-2 border-b border-stone-100 dark:border-zinc-800">
              {currentPageData.title}
            </h1>
          )}

          {/* Paragraphs */}
          <div className="font-serif text-base md:text-lg leading-relaxed text-stone-800 dark:text-stone-200 space-y-4">
            {currentPageData.paragraphs.map((p, idx) => {
              // Highlight Bible references in the text
              const refs = parseBibleReferences(p);
              if (refs.length > 0) {
                return (
                  <div key={idx} className="relative">
                    <p>
                      {p.split(refs[0].raw)[0]}
                      {/* Clickable Reference Chip */}
                      <span
                        onClick={() => handleSelectReference(refs[0].raw)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-[#9E7D3B] dark:text-[#E5C175] font-semibold border border-amber-300 dark:border-amber-800/60 cursor-pointer shadow-xs hover:bg-amber-200"
                      >
                        📖 {refs[0].raw}
                      </span>
                      {p.split(refs[0].raw)[1]}
                    </p>

                    {/* Scripture Toolkit Popover matching Mockup Screen 5: [Open Scripture] [Preview] [Save] [Copy] */}
                    {showTooltip && detectedRef?.raw === refs[0].raw && (
                      <div className="my-3 p-2 bg-[#1E293B] dark:bg-black text-white rounded-2xl shadow-xl border border-stone-700 flex items-center justify-around gap-1 max-w-sm animate-fade-in">
                        <button
                          onClick={() => onOpenInBible(detectedRef)}
                          className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-700/60 transition-colors text-zinc-200"
                        >
                          <BookOpen size={16} className="text-[#E5C175]" />
                          <span className="text-[10px] mt-1">Open Scripture</span>
                        </button>

                        <button
                          onClick={() => onOpenScriptureToolkit(detectedRef)}
                          className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-700/60 transition-colors text-zinc-200"
                        >
                          <Eye size={16} className="text-teal-400" />
                          <span className="text-[10px] mt-1">Preview</span>
                        </button>

                        <button
                          onClick={() => {
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-700/60 transition-colors text-zinc-200"
                        >
                          <Bookmark size={16} className="text-amber-400" />
                          <span className="text-[10px] mt-1">Save</span>
                        </button>

                        <button
                          onClick={handleCopy}
                          className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-700/60 transition-colors text-zinc-200"
                        >
                          {copied ? (
                            <Check size={16} className="text-emerald-400" />
                          ) : (
                            <Copy size={16} className="text-blue-400" />
                          )}
                          <span className="text-[10px] mt-1">{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return <p key={idx}>{p}</p>;
            })}

            {/* Quote Callout */}
            <blockquote className="my-6 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border-l-3 border-[#C5A059] italic text-stone-700 dark:text-stone-300">
              “Now faith is the substance of things hoped for, the evidence of things not seen.”
            </blockquote>
          </div>
        </div>
      </div>

      {/* Bottom Reading Toolbar matching Mockup Screen 5 */}
      <div className="h-14 border-t border-stone-200/90 dark:border-zinc-800/90 px-4 flex items-center justify-between bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm z-20">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPageNum - 1)}
            disabled={currentPageNum <= 1}
            className="p-2 rounded-xl text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-40"
            title="Previous Page"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs font-semibold px-2">
            {currentPageNum} / {doc?.pageCount || 8}
          </span>
          <button
            onClick={() => handlePageChange(currentPageNum + 1)}
            disabled={currentPageNum >= (doc?.pageCount || 8)}
            className="p-2 rounded-xl text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-40"
            title="Next Page"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (detectedRef) onOpenScriptureToolkit(detectedRef);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C5A059]/15 text-[#9E7D3B] dark:text-[#E5C175] text-xs font-bold hover:bg-[#C5A059]/25"
          >
            <BookOpen size={14} />
            <span>Scripture Toolkit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

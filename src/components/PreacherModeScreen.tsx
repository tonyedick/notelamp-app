import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sun,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Volume2,
  Lock,
  Unlock,
} from 'lucide-react';
import { Note, BibleReference } from '../domain/model/types';
import { NoteRepository } from '../data/repository/NoteRepository';
import { BibleRepository } from '../data/repository/BibleRepository';
import { parseBibleReferences, formatBibleReference } from '../domain/parser/bibleReferenceParser';

interface PreacherModeScreenProps {
  noteId: string;
  onExit: () => void;
  onOpenScripture: (ref: BibleReference) => void;
}

export const PreacherModeScreen: React.FC<PreacherModeScreenProps> = ({
  noteId,
  onExit,
  onOpenScripture,
}) => {
  const [note, setNote] = useState<Note | null>(null);
  const [fontSize, setFontSize] = useState<number>(24);
  const [currentSection, setCurrentSection] = useState<number>(4);
  const [totalSections, setTotalSections] = useState<number>(12);
  const [sections, setSections] = useState<string[]>([]);

  // Preacher Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isAwakeLocked, setIsAwakeLocked] = useState<boolean>(false);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    const existing = NoteRepository.getNoteById(noteId);
    if (existing) {
      setNote(existing);
      // Split content into presentation sections / slides by double newline or headers
      const rawSections = existing.content
        .split(/(?=\n[I|V|X]+\.|\n##|\n\n)/g)
        .map((s) => s.trim())
        .filter(Boolean);

      if (rawSections.length > 0) {
        setSections(rawSections);
        setTotalSections(rawSections.length);
        setCurrentSection(Math.min(4, rawSections.length));
      } else {
        setSections([existing.content]);
        setTotalSections(1);
        setCurrentSection(1);
      }
    }

    // Attempt Screen Wake Lock API for mobile preaching
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && (navigator as any).wakeLock) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          setIsAwakeLocked(true);
        }
      } catch (e) {
        console.warn('Wake Lock not available or rejected:', e);
      }
    };
    requestWakeLock();

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release?.().catch(() => {});
      }
    };
  }, [noteId]);

  // Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handlePrev = () => {
    setCurrentSection((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentSection((prev) => Math.min(totalSections, prev + 1));
  };

  const activeSectionText = sections[currentSection - 1] || note?.content || '';
  const detectedInActiveSection = parseBibleReferences(activeSectionText);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0D12] text-white flex flex-col select-none font-serif overflow-hidden">
      {/* Top Preacher Status Bar (Mockup Screen 7) */}
      <div className="h-16 border-b border-zinc-800/80 px-4 flex items-center justify-between bg-black/60 backdrop-blur-md">
        {/* Exit Button */}
        <button
          onClick={onExit}
          className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Exit Preacher Mode"
        >
          <X size={22} />
        </button>

        {/* Sermon Title & Meta */}
        <div className="text-center min-w-0 px-2">
          <h2 className="font-serif font-bold text-sm md:text-base text-zinc-100 truncate">
            {note?.title || "The Power of God's Presence"}
          </h2>
          <span className="text-[11px] font-sans text-[#E5C175] tracking-wide uppercase font-semibold">
            Sermon Notes • Preacher Mode
          </span>
        </div>

        {/* Controls: Timer & Font Scaler (Aa) */}
        <div className="flex items-center gap-2">
          {/* Preaching Stopwatch */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <span className="text-[#E5C175] font-bold">{formatTime(timerSeconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-zinc-400 hover:text-white"
            >
              {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
            </button>
            <button
              onClick={() => setTimerSeconds(0)}
              className="text-zinc-500 hover:text-zinc-300 ml-0.5"
              title="Reset Timer"
            >
              <RotateCcw size={11} />
            </button>
          </div>

          {/* Font Size Adjuster Aa */}
          <div className="flex items-center bg-zinc-900 rounded-xl border border-zinc-800 p-0.5">
            <button
              onClick={() => setFontSize((f) => Math.max(18, f - 2))}
              className="w-7 h-7 flex items-center justify-center text-xs font-sans font-bold text-zinc-400 hover:text-white"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize((f) => Math.min(36, f + 2))}
              className="w-7 h-7 flex items-center justify-center text-sm font-sans font-bold text-zinc-200 hover:text-white"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Main Preaching Viewport (Mockup Screen 7) */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 flex flex-col justify-center max-w-3xl mx-auto w-full">
        <div className="space-y-6 animate-fade-in">
          {/* Main Sermon Text */}
          <p
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
            className="text-zinc-100 font-serif leading-relaxed tracking-wide"
          >
            {activeSectionText}
          </p>

          {/* Golden Scripture Highlight Box (Mockup Screen 7: 2 Chronicles 5:14) */}
          {detectedInActiveSection.length > 0 && (
            <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-transparent border-l-4 border-[#C5A059] shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-[#E5C175] text-lg">
                  {formatBibleReference(detectedInActiveSection[0])}
                </span>
                <button
                  onClick={() => onOpenScripture(detectedInActiveSection[0])}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-[#E5C175] text-xs font-sans font-semibold hover:bg-amber-500/30"
                >
                  <BookOpen size={13} />
                  <span>Scripture</span>
                </button>
              </div>

              {/* Exact KJV Scripture Callout */}
              <p
                style={{ fontSize: `${fontSize * 0.9}px` }}
                className="text-amber-100/90 italic font-serif leading-relaxed"
              >
                {BibleRepository.getVersesForReference(detectedInActiveSection[0])[0]?.text ||
                  'When the priests came out of the holy place, the glory of the Lord filled the house of God.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Teleprompter Navigator (Mockup Screen 7: < 4 / 12 >) */}
      <div className="h-20 border-t border-zinc-800/80 px-6 flex items-center justify-between bg-black/80 backdrop-blur-md">
        <button
          onClick={handlePrev}
          disabled={currentSection <= 1}
          className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 cursor-pointer active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center gap-4">
          <div className="font-mono text-base font-bold text-zinc-300">
            <span className="text-[#E5C175]">{currentSection}</span> / {totalSections}
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="w-11 h-11 rounded-full bg-[#C5A059] text-stone-950 flex items-center justify-center shadow-lg hover:bg-[#B8944B] active:scale-95 cursor-pointer"
          >
            {isTimerRunning ? <Pause size={18} /> : <Play size={18} className="fill-current ml-0.5" />}
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSection >= totalSections}
          className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 cursor-pointer active:scale-95"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

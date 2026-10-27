import React from 'react';
import { X, BookOpen, Sparkles, Check, Phone, Mail, ShieldCheck, Heart, Download } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FAF7F2] dark:bg-[#18181B] rounded-3xl shadow-2xl border border-amber-900/15 dark:border-zinc-800 p-6 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-300 p-0.5 shadow-sm">
              <div className="w-full h-full bg-[#141C2B] rounded-[14px] flex items-center justify-center">
                <BookOpen size={20} className="text-[#E5C175]" />
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                About NoteLamp
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Version 1.0.0 • Native MVP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="py-4 overflow-y-auto space-y-4 pr-1 text-xs text-stone-700 dark:text-zinc-300 leading-relaxed">
          {/* Hero Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-[#E5C175] border border-amber-500/30">
              <Sparkles size={11} />
              <span>Offline-First Sermon Studio</span>
            </span>
            <h4 className="font-serif font-bold text-base text-white">
              Study deeper. Preach clearer. Stay in the Word.
            </h4>
            <p className="text-zinc-300 text-[11px] leading-normal">
              NoteLamp was engineered specifically for pastors, ministers, and Bible teachers who demand a reliable, distraction-free companion behind the pulpit.
            </p>
          </div>

          {/* Pillars */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-[11px] uppercase tracking-wider text-stone-400 dark:text-zinc-500">
              Core Capabilities
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-stone-200/80 dark:border-zinc-700 flex items-start gap-2.5">
                <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 dark:text-stone-100 font-serif">
                    Deterministic Bible Reference Detection
                  </strong>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                    Recognises Scripture as you type (e.g. John 3:16, 2 Chronicles 5:14) without requiring internet or AI calls.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-stone-200/80 dark:border-zinc-700 flex items-start gap-2.5">
                <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 dark:text-stone-100 font-serif">
                    Pulpit-Ready Preacher Mode
                  </strong>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                    OLED dark high-contrast teleprompter with Screen Wake Lock, elapsed stopwatch, and adjustable font scaling.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-stone-200/80 dark:border-zinc-700 flex items-start gap-2.5">
                <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 dark:text-stone-100 font-serif">
                    Offline KJV Canon & PDF Reader
                  </strong>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                    Bundled 66-book catalog, instant verse search, and PDF reader that preserves page positions and enables Scripture previews.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Ministry Information */}
          <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-zinc-800/90 border border-stone-200/90 dark:border-zinc-700 space-y-2">
            <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">
              Ministry Support & Contact
            </h4>
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-emerald-600 dark:text-emerald-400" />
                <a href="tel:+2348164119632" className="hover:underline font-mono">
                  +2348164119632
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-blue-600 dark:text-blue-400" />
                <a href="mailto:support@notelamp.com" className="hover:underline">
                  support@notelamp.com
                </a>
              </div>
            </div>
          </div>

          {/* Legal / Scripture attribution */}
          <p className="text-[10px] text-stone-400 dark:text-zinc-500 text-center pt-2">
            Scripture quotations are from the Authorized King James Version (KJV), in the Public Domain.
            <br />
            © 2026 NoteLamp. All rights reserved.
          </p>
        </div>

        {/* Footer with Download Source Code & Close */}
        <div className="pt-3 border-t border-stone-200 dark:border-zinc-800 space-y-2">
          <a
            href="/notelamp-source.zip"
            download="notelamp-source.zip"
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-center"
          >
            <Download size={15} />
            <span>Download Complete Source Code (.ZIP)</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#C5A059] text-stone-950 font-bold text-xs hover:bg-[#B8944B] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

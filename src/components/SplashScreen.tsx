import React from 'react';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative min-h-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#182333] via-[#0E1622] to-[#0A0E17] text-white overflow-hidden select-none">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacing */}
      <div className="pt-8 flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-[#E5C175] border border-amber-500/20">
          <Sparkles size={13} />
          <span>Offline-First Sermon Studio</span>
        </span>
      </div>

      {/* Main Hero Branding */}
      <div className="flex flex-col items-center text-center my-auto py-6">
        {/* Gold Emblem Book Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#B38734] via-[#D4AF37] to-[#F3E5AB] p-0.5 shadow-xl shadow-amber-950/40">
            <div className="w-full h-full bg-[#141C2B] rounded-[22px] flex items-center justify-center">
              <BookOpen size={46} className="text-[#E5C175]" strokeWidth={1.75} />
            </div>
          </div>
        </div>

        {/* App Title */}
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
          Note<span className="text-[#E5C175]">lamp</span>
        </h1>

        {/* Subtitle */}
        <p className="text-amber-200/80 text-sm tracking-wide uppercase font-semibold mb-6">
          Notes • Bible • Sermons
        </p>

        {/* Tagline */}
        <div className="max-w-xs space-y-1">
          <p className="text-zinc-300 font-serif text-lg leading-snug italic">
            "Study deeper. Preach clearer. Stay in the Word."
          </p>
          <p className="text-zinc-400 text-xs pt-1">
            All in one place. 100% offline with verified KJV Scripture.
          </p>
        </div>
      </div>

      {/* Bottom CTA Buttons matching Mockup Screen 1 */}
      <div className="space-y-3 pb-4">
        <button
          onClick={onGetStarted}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#B8944B] hover:to-[#C5A059] text-stone-950 font-bold text-base shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>

        <button
          onClick={onGetStarted}
          className="w-full py-2.5 text-center text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-colors"
        >
          Pastor James • Quick Sign In
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Wifi, Battery, Signal, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
  onToggleFrame: () => void;
  theme: string;
  fontSize?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  isFramed,
  onToggleFrame,
  theme,
  fontSize = 'medium',
}) => {
  const getThemeBg = () => {
    if (theme === 'light') return 'bg-white text-stone-900';
    if (theme === 'dark') return 'bg-[#0F1115] text-stone-100';
    return 'bg-[#FAF7F2] text-stone-900';
  };

  if (!isFramed) {
    return (
      <div
        data-theme={theme}
        data-font-size={fontSize}
        className={`relative w-full h-full flex flex-col min-h-screen ${getThemeBg()} transition-colors duration-200`}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900/90 dark:bg-black/95 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* Top Device Bar Switcher */}
      <div className="w-full max-w-[420px] flex items-center justify-between mb-2 text-stone-400 text-xs px-2">
        <span className="font-serif font-bold text-stone-300">NoteLamp Mobile</span>
        <button
          onClick={onToggleFrame}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-[11px] font-medium transition-colors"
          title="Toggle Full Screen Responsive View"
        >
          <Maximize2 size={12} />
          <span>Expand View</span>
        </button>
      </div>

      {/* Simulated Mobile Device Frame matching Mockup */}
      <div
        data-theme={theme}
        data-font-size={fontSize}
        className={`relative w-full max-w-[400px] h-[844px] max-h-[92vh] ${getThemeBg()} rounded-[48px] shadow-2xl border-[10px] border-[#2A2F38] ring-1 ring-white/10 flex flex-col overflow-hidden transition-colors duration-200`}
      >
        {/* Status Bar (9:41, Dynamic Island / Camera Cutout, Signal, Wifi, Battery) */}
        <div className="h-10 px-6 flex items-center justify-between shrink-0 bg-transparent text-stone-900 dark:text-stone-100 z-30 pointer-events-none">
          <span className="text-xs font-semibold tracking-tight font-sans">9:41</span>
          {/* Dynamic Island Pill */}
          <div className="w-24 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-stone-700 dark:text-zinc-300">
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={13} />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="h-4 flex items-center justify-center shrink-0 bg-transparent pointer-events-none pb-1">
          <div className="w-32 h-1 bg-stone-400/50 dark:bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

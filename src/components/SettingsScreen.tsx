import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Type,
  Book,
  DownloadCloud,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  Info,
  ChevronRight,
  Check,
  Play,
  CheckCircle2,
  XCircle,
  Smartphone,
  Phone,
  Mail,
  Sparkles,
  Download,
} from 'lucide-react';
import { AppSettings, AppTheme, FontSize } from '../domain/model/types';
import { SettingsRepository } from '../data/repository/SettingsRepository';
import { runAllPulpitNotesTests, TestResult } from '../test/testRunner';
import { HelpSupportModal } from './HelpSupportModal';
import { FeedbackModal } from './FeedbackModal';
import { AboutModal } from './AboutModal';

interface SettingsScreenProps {
  onToggleDeviceFrame?: () => void;
  isDeviceFrameActive?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onToggleDeviceFrame,
  isDeviceFrameActive = true,
}) => {
  const [settings, setSettings] = useState<AppSettings>(SettingsRepository.getSettings());
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string>('Local First (Offline Ready)');

  // Modals state
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    const unsub = SettingsRepository.subscribe((s) => setSettings(s));
    return () => unsub();
  }, []);

  const handleThemeChange = (theme: AppTheme) => {
    SettingsRepository.setTheme(theme);
    // Apply immediate data attributes and dark class to document
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleFontSizeChange = (size: FontSize) => {
    SettingsRepository.setFontSize(size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const results = runAllPulpitNotesTests();
      setTestResults(results);
      setIsRunningTests(false);
    }, 200);
  };

  const passCount = testResults?.filter((r) => r.passed).length || 0;
  const totalCount = testResults?.length || 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 bg-[#FAF7F2] dark:bg-[#0F1115] text-stone-900 dark:text-stone-100 transition-colors">
      <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100 mb-4 px-1">
        Settings
      </h2>

      {/* User Profile Card matching Mockup Screen 11 */}
      <div className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 border border-stone-200/80 dark:border-zinc-700/80 shadow-xs flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 p-0.5">
            <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center text-amber-200 font-bold text-lg">
              PJ
            </div>
          </div>
          <div>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
              {settings.userName}
            </h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400">{settings.userEmail}</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-stone-400" />
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-zinc-800/80 rounded-2xl border border-stone-200/80 dark:border-zinc-700/80 shadow-xs overflow-hidden mb-5">
        {/* Appearance Row with Light, Cream, Dark mode switches */}
        <div className="p-4 border-b border-stone-100 dark:border-zinc-700/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {settings.theme === 'dark' ? (
              <Moon size={18} className="text-amber-400" />
            ) : (
              <Sun size={18} className="text-amber-500" />
            )}
            <div>
              <span className="text-sm font-medium">Appearance</span>
              <p className="text-[11px] text-stone-400 dark:text-zinc-500">
                Light, Warm Cream, or Dark OLED
              </p>
            </div>
          </div>

          <div className="flex items-center bg-stone-100 dark:bg-zinc-700 rounded-xl p-1 gap-1">
            <button
              onClick={() => handleThemeChange('light')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                settings.theme === 'light'
                  ? 'bg-white shadow-xs text-stone-900 ring-1 ring-stone-300 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange('cream')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                settings.theme === 'cream'
                  ? 'bg-[#FAF7F2] shadow-xs text-amber-900 ring-1 ring-amber-300 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Cream
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                settings.theme === 'dark'
                  ? 'bg-zinc-900 shadow-xs text-[#E5C175] ring-1 ring-zinc-600 font-bold'
                  : 'text-stone-500 hover:text-zinc-200'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Bible Version */}
        <div className="p-4 border-b border-stone-100 dark:border-zinc-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book size={18} className="text-blue-500" />
            <span className="text-sm font-medium">Bible Version</span>
          </div>
          <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400">
            KJV (Public Domain) ›
          </span>
        </div>

        {/* Font Size Row: Small, Medium, Large */}
        <div className="p-4 border-b border-stone-100 dark:border-zinc-700/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Type size={18} className="text-emerald-500" />
            <div>
              <span className="text-sm font-medium">Font Size</span>
              <p className="text-[11px] text-stone-400 dark:text-zinc-500">
                Current: <strong className="capitalize">{settings.fontSize}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center bg-stone-100 dark:bg-zinc-700 rounded-xl p-1 gap-1">
            {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
              <button
                key={size}
                onClick={() => handleFontSizeChange(size)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                  settings.fontSize === size
                    ? 'bg-white dark:bg-zinc-800 shadow-xs font-bold text-[#C5A059] ring-1 ring-[#C5A059]/40'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-zinc-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Offline Bible Status */}
        <div className="p-4 border-b border-stone-100 dark:border-zinc-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DownloadCloud size={18} className="text-teal-500" />
            <span className="text-sm font-medium">Offline Bible</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Check size={14} />
            <span>Downloaded (66 Books Verified)</span>
          </div>
        </div>

        {/* Sync & Backup */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw size={18} className="text-indigo-500" />
            <span className="text-sm font-medium">Sync & Backup</span>
          </div>
          <span className="text-xs font-semibold text-[#9E7D3B] dark:text-[#E5C175]">
            {syncStatusMsg}
          </span>
        </div>
      </div>

      {/* Frame / Viewport Mode Toggle */}
      {onToggleDeviceFrame && (
        <div className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 border border-stone-200/80 dark:border-zinc-700/80 shadow-xs flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Smartphone size={18} className="text-purple-500" />
            <div>
              <span className="text-sm font-medium">Device Frame Mode</span>
              <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                {isDeviceFrameActive ? 'Mobile Phone Simulator' : 'Full Screen Responsive'}
              </p>
            </div>
          </div>
          <button
            onClick={onToggleDeviceFrame}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-zinc-700 hover:bg-stone-200 text-stone-800 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            {isDeviceFrameActive ? 'Switch to Full' : 'Switch to Phone'}
          </button>
        </div>
      )}

      {/* Interactive Support, Feedback & About NoteLamp Actions */}
      <div className="bg-white dark:bg-zinc-800/80 rounded-2xl border border-stone-200/80 dark:border-zinc-700/80 shadow-xs overflow-hidden mb-5">
        {/* Help & Support (Phone & Email Details) */}
        <div
          onClick={() => setShowHelpModal(true)}
          className="p-4 border-b border-stone-100 dark:border-zinc-700/60 flex items-center justify-between cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-700/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Phone size={16} />
            </div>
            <div>
              <span className="text-sm font-medium">Help & Support</span>
              <p className="text-[11px] text-stone-400 dark:text-zinc-500">
                +2348164119632 • support@notelamp.com
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-stone-400" />
        </div>

        {/* Give Feedback */}
        <div
          onClick={() => setShowFeedbackModal(true)}
          className="p-4 border-b border-stone-100 dark:border-zinc-700/60 flex items-center justify-between cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-700/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
            <div>
              <span className="text-sm font-medium">Give Feedback</span>
              <p className="text-[11px] text-stone-400 dark:text-zinc-500">
                Send suggestions, feature requests, or report issues
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-stone-400" />
        </div>

        {/* About NoteLamp */}
        <div
          onClick={() => setShowAboutModal(true)}
          className="p-4 border-b border-stone-100 dark:border-zinc-700/60 flex items-center justify-between cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-700/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Info size={16} />
            </div>
            <div>
              <span className="text-sm font-medium">About NoteLamp</span>
              <p className="text-[11px] text-stone-400 dark:text-zinc-500">
                Overview, mission, offline Bible & teleprompter
              </p>
            </div>
          </div>
          <span className="text-xs text-[#C5A059] font-bold">v1.0.0 ›</span>
        </div>

        {/* Download Source Code (.ZIP) */}
        <a
          href="/notelamp-source.zip"
          download="notelamp-source.zip"
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-700/40 transition-colors text-inherit"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Download size={16} />
            </div>
            <div>
              <span className="text-sm font-medium">Download Source Code</span>
              <p className="text-[11px] text-stone-400 dark:text-zinc-500">
                Get full project files as .ZIP archive
              </p>
            </div>
          </div>
          <span className="text-xs bg-stone-100 dark:bg-zinc-700 px-2 py-1 rounded-md font-mono text-stone-600 dark:text-zinc-300 font-semibold">
            .ZIP
          </span>
        </a>
      </div>

      {/* Automated Diagnostic Test Suite */}
      <div className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 border border-stone-200/80 dark:border-zinc-700/80 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
              Automated Architecture Tests
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-zinc-400">
              Validates reference parser, verse retrieval, persistence, and PDF reader
            </p>
          </div>
          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C5A059] text-stone-950 font-bold text-xs hover:bg-[#B8944B] active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Play size={12} className="fill-current" />
            <span>{isRunningTests ? 'Running...' : 'Run Tests'}</span>
          </button>
        </div>

        {testResults && (
          <div className="space-y-2 mt-3 pt-3 border-t border-stone-100 dark:border-zinc-700">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-stone-700 dark:text-zinc-300">
                Test Results: {passCount} / {totalCount} Passed
              </span>
              <span
                className={`px-2 py-0.5 rounded-md ${
                  passCount === totalCount
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {passCount === totalCount ? 'All Passed ✓' : 'Failures Detected'}
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {testResults.map((t, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-stone-50 dark:bg-zinc-900/60 text-xs flex items-center justify-between border border-stone-200/50 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {t.passed ? (
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-rose-500 shrink-0" />
                    )}
                    <span className="truncate text-stone-800 dark:text-zinc-200">
                      [{t.suite}] {t.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono ml-2 shrink-0">
                    {t.durationMs}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals Rendering */}
      {showHelpModal && <HelpSupportModal onClose={() => setShowHelpModal(false)} />}
      {showFeedbackModal && <FeedbackModal onClose={() => setShowFeedbackModal(false)} />}
      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}
    </div>
  );
};

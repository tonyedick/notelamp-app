import React, { useState } from 'react';
import { X, Phone, Mail, Copy, Check, Clock, ShieldCheck, MessageCircle } from 'lucide-react';

interface HelpSupportModalProps {
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const phone = '+2348164119632';
  const email = 'support@notelamp.com';

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FAF7F2] dark:bg-[#18181B] rounded-3xl shadow-2xl border border-amber-900/15 dark:border-zinc-800 p-6 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-[#9E7D3B] dark:text-[#E5C175] flex items-center justify-center font-bold">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                Help & Support
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                NoteLamp Ministry Support Team
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

        {/* Content */}
        <div className="py-4 overflow-y-auto space-y-4 pr-1">
          {/* Direct Contact Cards */}
          <div className="space-y-3">
            {/* Phone Card */}
            <div className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 border border-stone-200/90 dark:border-zinc-700 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Phone size={19} />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-stone-400 dark:text-zinc-400 uppercase tracking-wider">
                    Phone Support / WhatsApp
                  </span>
                  <a
                    href={`tel:${phone}`}
                    className="block font-mono font-bold text-sm text-stone-900 dark:text-stone-100 hover:text-[#C5A059] transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyToClipboard(phone, 'phone')}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-zinc-700 hover:bg-stone-200 text-stone-600 dark:text-zinc-300 transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedType === 'phone' ? (
                    <Check size={16} className="text-emerald-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <a
                  href={`tel:${phone}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                >
                  Call
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 border border-stone-200/90 dark:border-zinc-700 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Mail size={19} />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-stone-400 dark:text-zinc-400 uppercase tracking-wider">
                    Official Email
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="block font-medium text-sm text-stone-900 dark:text-stone-100 hover:text-[#C5A059] transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyToClipboard(email, 'email')}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-zinc-700 hover:bg-stone-200 text-stone-600 dark:text-zinc-300 transition-colors"
                  title="Copy Email"
                >
                  {copiedType === 'email' ? (
                    <Check size={16} className="text-emerald-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <a
                  href={`mailto:${email}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                >
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* Quick Support Info */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <Clock size={14} className="text-[#C5A059]" />
              <span>Support Hours: Monday – Saturday (8:00 AM – 9:00 PM GMT+1)</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-zinc-400">
              Need assistance preparing sermons, importing PDF study guides, or setting up offline Scripture on your devices? Reach out anytime.
            </p>
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-stone-400 dark:text-zinc-500">
              Frequently Asked Questions
            </h4>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/60 border border-stone-200/80 dark:border-zinc-700/80 text-xs">
              <p className="font-bold text-stone-900 dark:text-stone-100 mb-1">
                Does NoteLamp require internet on the pulpit?
              </p>
              <p className="text-stone-600 dark:text-zinc-400">
                No. NoteLamp is completely offline-first. All your sermon notes, canonical KJV Bible passages, and PDF readers function without WiFi or cellular data.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/60 border border-stone-200/80 dark:border-zinc-700/80 text-xs">
              <p className="font-bold text-stone-900 dark:text-stone-100 mb-1">
                How do I prevent my screen from dimming while preaching?
              </p>
              <p className="text-stone-600 dark:text-zinc-400">
                Simply tap <strong>Preacher Mode</strong> on any sermon note. It activates the Screen Wake Lock so your device stays bright throughout your sermon.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#C5A059] text-stone-950 font-bold text-xs hover:bg-[#B8944B] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Send, Star, CheckCircle, MessageSquare, Sparkles } from 'lucide-react';

interface FeedbackModalProps {
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'feature' | 'bug' | 'suggestion' | 'praise'>('suggestion');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setErrorMessage('Please enter a feedback subject.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a brief description.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    // Simulate sending feedback and store locally
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('notelamp_feedbacks') || '[]');
        existing.unshift({
          id: `fb_${Date.now()}`,
          subject,
          description,
          category,
          rating,
          createdAt: Date.now(),
        });
        localStorage.setItem('notelamp_feedbacks', JSON.stringify(existing));
      } catch (err) {
        console.warn('Could not save feedback to local store', err);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FAF7F2] dark:bg-[#18181B] rounded-3xl shadow-2xl border border-amber-900/15 dark:border-zinc-800 p-6 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/15 text-[#9E7D3B] dark:text-[#E5C175] flex items-center justify-center font-bold">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                Give Feedback
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Help us refine NoteLamp for ministers
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

        {/* Form Body or Success Confirmation */}
        {isSubmitted ? (
          <div className="py-10 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle size={36} />
            </div>
            <h4 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              Thank You, Pastor!
            </h4>
            <p className="text-xs text-stone-600 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
              Your feedback has been received and queued for the NoteLamp engineering team. Your insights help equip pastors worldwide!
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#C5A059] text-stone-950 font-bold text-xs hover:bg-[#B8944B] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 overflow-y-auto space-y-4 pr-1">
            {/* Category selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-1.5">
                Feedback Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'suggestion', label: '💡 Sermon Suggestion' },
                  { id: 'feature', label: '✨ Feature Request' },
                  { id: 'bug', label: '🐛 Bug Report' },
                  { id: 'praise', label: '🙏 Testimony / Praise' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all ${
                      category === item.id
                        ? 'bg-[#C5A059] text-stone-950 shadow-xs'
                        : 'bg-white dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-zinc-300 hover:bg-stone-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Additional Bible translations, Preacher mode font scaling..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-stone-200/90 dark:border-zinc-700 text-xs text-stone-900 dark:text-stone-100 outline-hidden focus:border-[#C5A059]"
              />
            </div>

            {/* Experience Rating */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-1.5">
                How would you rate NoteLamp?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={24}
                      className={
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-stone-300 dark:text-zinc-600'
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400 ml-2">
                  {rating === 5 ? '5/5 Excellent' : `${rating}/5`}
                </span>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-1.5">
                Description & Notes
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share your thoughts, suggestions, or describe any issue you encountered..."
                rows={4}
                className="w-full p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-stone-200/90 dark:border-zinc-700 text-xs text-stone-900 dark:text-stone-100 outline-hidden focus:border-[#C5A059] resize-none"
              />
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 animate-shake">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#B8944B] hover:to-[#C5A059] text-stone-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send size={15} />
                <span>{isSubmitting ? 'Sending Feedback...' : 'Send Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Bookmark,
  Share2,
  Info,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AnswerCard() {
  const {
    currentAnswer,
    isGeneratingAnswer,
    generationStep,
    toggleSaveCurrentAnswer,
    savedAnswers,
    addToast
  } = useApp();

  const [feedback, setFeedback] = useState(null); // 'helpful' | 'not-helpful' | null
  const [copied, setCopied] = useState(false);

  if (!currentAnswer && !isGeneratingAnswer) return null;

  const isSaved = savedAnswers.some(s => s.question === currentAnswer?.question);

  const handleCopy = () => {
    if (!currentAnswer) return;
    const textToCopy = `TRIALLENS Evidence Synthesis
Question: ${currentAnswer.question}
Answer: ${currentAnswer.leadText}
${(currentAnswer.bullets || []).map(b => `• ${b.name}: ${b.stat}`).join('\n')}
${currentAnswer.summary}

Sources:
${(currentAnswer.sources || []).map(s => `- ${s.name} (${s.section}, Page ${s.page})`).join('\n')}`;

    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    addToast({
      title: "Synthesis Copied",
      message: "Answer and citations copied to clipboard in markdown format.",
      type: "success"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      title: "Share Link Generated",
      message: "Direct link to this clinical answer copied to clipboard.",
      type: "success"
    });
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    addToast({
      title: "Feedback Recorded",
      message: type === 'helpful' ? "Thank you! Flagged as high-confidence citation." : "Feedback noted. Flagged for clinical review.",
      type: "info"
    });
  };

  return (
    <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-6 shadow-lg relative overflow-hidden">
      {/* Loading & RAG Step Animation */}
      {isGeneratingAnswer ? (
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shadow-glow">
              <Sparkles className="w-7 h-7 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur-md -z-10 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-white text-base">Retrieving Clinical Evidence</h4>
            <p className="text-xs text-blue-400 font-mono flex items-center justify-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{generationStep || "Cross-referencing verified trial records..."}</span>
            </p>
          </div>

          <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="w-1/2 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#0a1122] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-white text-base tracking-tight">Answer</h3>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Based on {currentAnswer.sourceCount || (currentAnswer.sources?.length || 3)} sources
                  </span>
                </div>
              </div>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              {currentAnswer.timestamp || "22 Sep 2026, 11:24 AM"}
            </span>
          </div>

          {/* Answer Lead text */}
          <div className="space-y-3.5 text-sm leading-relaxed text-slate-200">
            <p className="font-medium text-slate-100">
              {currentAnswer.leadText}
            </p>

            {/* Bullets List (matches screenshot 2) */}
            {currentAnswer.bullets && currentAnswer.bullets.length > 0 && (
              <ul className="space-y-1.5 pl-1">
                {currentAnswer.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-baseline gap-2.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
                    <span>
                      <strong className="text-white font-semibold">{b.name}</strong> ({b.stat})
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Summary sentence */}
            {currentAnswer.summary && (
              <p className="text-xs text-slate-300 pt-1">
                {currentAnswer.summary}
              </p>
            )}
          </div>

          {/* Info Warning Notice Box (matches screenshot 2) */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-blue-200 text-xs leading-relaxed">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>
              {currentAnswer.warning || "This answer is generated only from the provided documents. Please verify the information using the cited sources."}
            </p>
          </div>

          {/* Action & Feedback Buttons Toolbar (matches screenshot 2) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/70">
            {/* Feedback: Helpful / Not helpful */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFeedback('helpful')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  feedback === 'helpful'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful</span>
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('not-helpful')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  feedback === 'not-helpful'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Not helpful</span>
              </button>
            </div>

            {/* Utility Actions: Copy, Save, Share */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy markdown answer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={toggleSaveCurrentAnswer}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSaved
                    ? 'text-blue-400 bg-blue-600/15 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Save answer"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-400 text-blue-400' : 'text-slate-400'}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Share link"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

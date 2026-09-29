import React, { useState } from 'react';
import { MessageSquare, RotateCw, ArrowRight, Paperclip, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FollowUpCard() {
  const { currentAnswer, executeAskQuestion, isGeneratingAnswer, addToast } = useApp();
  const [followUpText, setFollowUpText] = useState('');

  const questions = currentAnswer?.followUps || [
    "What were the serious adverse events in this trial?",
    "How did the safety profile of Drug X compare to placebo?",
    "Were there any study discontinuations due to adverse events?",
    "What was the most common adverse event in Phase 2?"
  ];

  const handleSelectQuestion = (q) => {
    executeAskQuestion(q);
  };

  const handleSendFollowUp = (e) => {
    e.preventDefault();
    if (!followUpText.trim() || isGeneratingAnswer) return;
    executeAskQuestion(followUpText.trim());
    setFollowUpText('');
  };

  const handleRegenerate = () => {
    if (currentAnswer?.question) {
      executeAskQuestion(currentAnswer.question);
      addToast({
        title: "Regenerating Answer",
        message: "Re-scanning clinical trial documentation with high-depth sampling...",
        type: "info"
      });
    }
  };

  return (
    <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <h4 className="font-bold text-white text-sm tracking-tight">Follow-up Questions</h4>
        </div>
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isGeneratingAnswer}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Questions list with right arrows */}
      <div className="space-y-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectQuestion(q)}
            disabled={isGeneratingAnswer}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 hover:bg-slate-800/70 border border-slate-800 hover:border-blue-500/40 text-left text-xs font-medium text-slate-300 hover:text-white transition-all group disabled:opacity-50"
          >
            <span className="truncate pr-2">{q}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>

      {/* Bottom Follow-up Input */}
      <form onSubmit={handleSendFollowUp} className="pt-2">
        <div className="flex items-center gap-2 bg-[#080d19] border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
          <button
            type="button"
            className="text-slate-400 hover:text-slate-200 p-1"
            title="Attach clinical document reference"
            onClick={() => {
              addToast({
                title: "Document Reference",
                message: "Active source references attached to prompt query.",
                type: "info"
              });
            }}
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none py-1.5"
          />

          <button
            type="submit"
            disabled={!followUpText.trim() || isGeneratingAnswer}
            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-blue-600/30 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

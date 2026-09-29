import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function QuestionInputCard() {
  const { currentQuery, executeAskQuestion, isGeneratingAnswer } = useApp();
  const [inputValue, setInputValue] = useState(currentQuery);

  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isGeneratingAnswer) {
      executeAskQuestion(inputValue.trim());
    }
  };

  const chips = [
    "Common adverse events for Drug X",
    "Efficacy results in Phase 3",
    "Compare Drug X and Drug Y",
    "Show safety updates"
  ];

  return (
    <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-5 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input box */}
        <div className="relative rounded-xl bg-[#080d19] border border-slate-700/80 p-3 shadow-inner focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <textarea
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your clinical research question here..."
            className="w-full bg-transparent text-white text-sm placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={isGeneratingAnswer || !inputValue.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-600/30 hover:shadow-blue-500/50 transition-all"
            >
              <span>{isGeneratingAnswer ? 'Synthesizing...' : 'Ask'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Suggestion Chips (matches screenshot 2) */}
        <div className="flex flex-wrap gap-2 pt-0.5">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputValue(chip);
                executeAskQuestion(chip);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#0f1d38]/80 hover:bg-blue-950 hover:text-blue-300 border border-slate-700/60 hover:border-blue-500/50 transition-all text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

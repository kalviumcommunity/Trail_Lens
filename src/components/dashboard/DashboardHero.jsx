import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, FileText, Shield, Pill } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DashboardHero() {
  const { executeAskQuestion, currentQuery, documents } = useApp();
  const [inputVal, setInputVal] = useState('');
  const navigate = useNavigate();

  const handleAsk = (text) => {
    const q = text || inputVal;
    if (!q.trim()) return;
    executeAskQuestion(q.trim());
    navigate('/ask');
  };

  const primaryDoc = documents[0]?.name || "Phase 3 clinical trial";
  const chips = [
    "Progression-Free Survival results",
    "Reported treatment-emergent adverse events",
    "Contraindications and liver monitoring",
    "Summary of study design and objectives"
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c1b3b] via-[#0e1f44] to-[#0a152e] border border-blue-900/50 shadow-2xl p-6 sm:p-8">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-60 h-60 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Side: Input & Chips */}
        <div className="flex-1 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ask a research question
          </h2>
          <p className="text-sm text-slate-300 mt-1.5 font-normal">
            Get evidence-based answers from your clinical documents.
          </p>

          {/* Search Question Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-[#081022]/90 p-1.5 rounded-xl border border-slate-700/80 shadow-inner focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all"
          >
            <div className="flex items-center flex-1 px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. What were the major adverse events in the Phase 3 trial of Drug X?"
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none py-2"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 shrink-0"
            >
              <span>Ask</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Clickable Suggestion Chips */}
          <div className="mt-4 flex flex-wrap gap-2 pt-1">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAsk(chip)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#0f1d38]/80 hover:bg-blue-950 hover:text-blue-300 border border-slate-700/60 hover:border-blue-500/50 transition-all cursor-pointer text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Floating Graphic Card Stack (Matches screenshot 3) */}
        <div className="hidden lg:flex flex-col items-center justify-center relative w-72 h-44 shrink-0">
          {/* Overlapping tilted glass cards */}
          <div className="absolute top-0 right-10 w-44 h-24 rounded-xl bg-gradient-to-br from-blue-900/60 to-slate-900/80 border border-blue-500/30 shadow-xl backdrop-blur-md transform rotate-6 translate-x-2 -translate-y-2 p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-semibold text-slate-200">Clinical Trials</span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-1 bg-blue-500/30 rounded" />
              <div className="w-3/4 h-1 bg-blue-500/20 rounded" />
            </div>
          </div>

          <div className="absolute top-4 right-14 w-44 h-24 rounded-xl bg-gradient-to-br from-blue-950/80 to-slate-900/90 border border-blue-400/40 shadow-xl backdrop-blur-md transform -rotate-3 translate-x-1 p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px] font-semibold text-slate-200">Drug Labels</span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-1 bg-teal-500/30 rounded" />
              <div className="w-2/3 h-1 bg-teal-500/20 rounded" />
            </div>
          </div>

          <div className="absolute top-8 right-8 w-48 h-24 rounded-xl bg-[#0b162c] border border-blue-400/50 shadow-2xl backdrop-blur-md transform rotate-2 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-semibold text-slate-100">Safety Bulletins</span>
              </div>
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
            </div>
            <div className="mt-1">
              <p className="text-[10px] text-blue-300 font-medium">Powered by AI.</p>
              <p className="text-[9px] text-slate-400">Grounded in real evidence.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

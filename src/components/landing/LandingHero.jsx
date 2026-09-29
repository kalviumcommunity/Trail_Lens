import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Sparkles,
  FileText,
  ShieldCheck,
  BookmarkCheck,
  Zap,
  Bot,
  Pill,
  ShieldAlert,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export default function LandingHero({ onOpenDemo }) {
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
      {/* Background illumination & glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, CTAs, Feature Pills */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* AI-Powered Badge (matches screenshot 4) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Clinical Research Intelligence</span>
            </motion.div>

            {/* Big Headline (matches screenshot 4) */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]"
            >
              Ask questions.<br />
              Find evidence.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
                Trust the source.
              </span>
            </motion.h1>

            {/* Description (matches screenshot 4) */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed"
            >
              TrialLens is an AI-powered clinical research assistant that helps researchers get accurate, evidence-grounded answers from clinical trial reports, drug labels, and safety bulletins.
            </motion.p>

            {/* CTA Buttons (matches screenshot 4) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-[#0f172a]/90 hover:bg-[#1e293b] text-white text-sm font-semibold rounded-xl border border-slate-700/80 transition-all shadow-lg hover:border-slate-600"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Subtext */}
            <p className="text-xs text-slate-400 font-medium">
              Built for researchers. Grounded in real evidence.
            </p>

            {/* 4 Feature Pills / Badges (matches screenshot 4) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 p-2 rounded-xl bg-[#090f1f]/60 border border-slate-800/50">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-[11px] font-semibold text-slate-200">Search Across Documents</span>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 p-2 rounded-xl bg-[#090f1f]/60 border border-slate-800/50">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-semibold text-slate-200">Evidence-Based Answers</span>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 p-2 rounded-xl bg-[#090f1f]/60 border border-slate-800/50">
                <BookmarkCheck className="w-4 h-4 text-purple-400" />
                <span className="text-[11px] font-semibold text-slate-200">Exact Source Citations</span>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 p-2 rounded-xl bg-[#090f1f]/60 border border-slate-800/50">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-semibold text-slate-200">Save Time / Do Research</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Animated App Window Mockup + Floating Doc Stack */}
          <div className="lg:col-span-6 relative">
            {/* Hand-drawn style annotation 1 */}
            <div className="hidden sm:block absolute -top-8 right-6 z-20 pointer-events-none">
              <span className="text-xs font-mono text-cyan-300 font-semibold italic flex items-center gap-1.5">
                From documents to answers <span className="text-lg">⤵</span>
              </span>
            </div>

            {/* Main Browser Mockup Window (matches screenshot 4) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl bg-[#0b1222] border border-blue-500/30 shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#090e1b] border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#0c1427] border border-slate-800 rounded-md text-[10px] text-slate-400 font-mono">
                  <span>app.triallens.com/ask</span>
                </div>
                <div className="w-8" />
              </div>

              {/* App UI inside window */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Mini Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      TL
                    </div>
                    <span className="text-xs font-extrabold text-white">TRIALLENS</span>
                  </div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                    Ask a Question
                  </span>
                </div>

                {/* Input snippet */}
                <div className="p-2.5 rounded-xl bg-[#080d19] border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300 truncate max-w-[260px]">
                    What are the most common adverse events in Phase 3 of Drug X?
                  </span>
                  <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Answer card snippet */}
                <div className="p-3.5 rounded-xl bg-[#0e172a] border border-blue-900/40 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">Answer</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">
                        Based on 3 sources
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500">22 Sep 2026</span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    In the Phase 3 trial of Drug X, the most common adverse events reported were:
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-300 pl-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-blue-400 rounded-full" />
                      <span><strong>Nausea</strong> (12.4%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-blue-400 rounded-full" />
                      <span><strong>Headache</strong> (10.1%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-blue-400 rounded-full" />
                      <span><strong>Fatigue</strong> (8.7%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-blue-400 rounded-full" />
                      <span><strong>Diarrhea</strong> (6.3%)</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-blue-950/40 border border-blue-800/40 text-[10px] text-blue-200">
                    ℹ️ Grounded only in Study_ABC_Phase3.pdf & DrugX_Label.pdf.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Overlapping Floating Document Cards Stack (matches screenshot 4) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -right-4 sm:-right-8 top-12 z-20 flex flex-col gap-2 pointer-events-none"
            >
              {/* Clinical Trial Report Card */}
              <div className="w-44 sm:w-52 p-3 rounded-xl bg-[#0c162b]/95 border border-blue-400/40 shadow-2xl backdrop-blur-md transform rotate-3 animate-float space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-blue-300 tracking-wider">
                    CLINICAL TRIAL REPORT
                  </span>
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="space-y-1">
                  <div className="w-full h-1 bg-blue-400/40 rounded" />
                  <div className="w-3/4 h-1 bg-blue-400/30 rounded" />
                  <div className="w-1/2 h-1 bg-blue-400/20 rounded" />
                </div>
              </div>

              {/* Drug Label Card */}
              <div className="w-40 sm:w-48 p-2.5 rounded-xl bg-[#081122]/95 border border-teal-400/40 shadow-xl backdrop-blur-md transform -rotate-2 -translate-x-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-teal-300 tracking-wider">
                    DRUG LABEL
                  </span>
                  <Pill className="w-3 h-3 text-teal-400" />
                </div>
                <div className="space-y-1">
                  <div className="w-full h-1 bg-teal-400/30 rounded" />
                  <div className="w-2/3 h-1 bg-teal-400/20 rounded" />
                </div>
              </div>

              {/* Safety Bulletin Card */}
              <div className="w-36 sm:w-44 p-2.5 rounded-xl bg-[#0a0f1d]/95 border border-amber-400/40 shadow-lg backdrop-blur-md transform rotate-1 -translate-x-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider">
                    SAFETY BULLETIN
                  </span>
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                </div>
                <div className="w-3/4 h-1 bg-amber-400/30 rounded" />
              </div>
            </motion.div>

            {/* Hand-drawn style annotation 2 */}
            <div className="hidden sm:block absolute -bottom-6 right-10 z-20 pointer-events-none">
              <span className="text-xs font-mono text-cyan-300 font-semibold italic flex items-center gap-1.5">
                Real documents. Real answers. <span className="text-lg">⤴</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

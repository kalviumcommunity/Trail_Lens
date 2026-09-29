import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, CheckCircle2, ArrowRight, Sparkles, FileText, Search, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DemoVideoModal({ isOpen, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: "1. Upload & OCR Parsing",
      subtitle: "Parsing 245-page Clinical Study Reports",
      description: "TrialLens analyzes multi-center Phase 3 PDFs, extracting complex incidence tables, Kaplan-Meier curves, and adverse reaction logs into a searchable vector index.",
      icon: FileText,
      badge: "High Precision Extraction"
    },
    {
      title: "2. Evidence-Grounded Querying",
      subtitle: "Asking natural language clinical questions",
      description: "Ask questions like 'What were the most common adverse events in Phase 3?' The RAG engine checks confidence across study reports, labels, and safety bulletins.",
      icon: Search,
      badge: "Zero AI Hallucination"
    },
    {
      title: "3. Direct Citation Highlighting",
      subtitle: "Auditing exact document pages & tables",
      description: "Every answer is rendered alongside the source PDF with exact paragraph highlighter and Table 12 data rows, giving medical monitors instant verification.",
      icon: ShieldCheck,
      badge: "Full GxP Audit Trail"
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-[#0c1427] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#090f1f] border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">TrialLens Interactive Product Tour</h3>
                <p className="text-xs text-slate-400">See how biopharma researchers accelerate trial analysis</p>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Player Simulation Screen */}
          <div className="p-6 bg-[#080d19] space-y-6">
            {/* Step Selector Pills */}
            <div className="flex gap-2">
              {demoSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center ${
                    activeStep === idx
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-[#0f172a] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>

            {/* Simulated Animated Tour Canvas */}
            <div className="relative rounded-2xl bg-[#0b1222] border border-blue-500/30 p-6 min-h-[260px] flex flex-col justify-between overflow-hidden shadow-inner">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {demoSteps[activeStep].badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">0:45 / 2:30</span>
                </div>

                <h4 className="text-lg font-bold text-white">
                  {demoSteps[activeStep].subtitle}
                </h4>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {demoSteps[activeStep].description}
                </p>
              </div>

              {/* Graphical simulation bar */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <span className="text-xs text-slate-400 font-medium">Auto-advancing interactive preview</span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/ask');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 rounded-xl text-xs font-semibold transition-all"
                >
                  <span>Try It Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

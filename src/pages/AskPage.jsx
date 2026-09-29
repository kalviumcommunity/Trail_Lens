import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, X, ArrowRight } from 'lucide-react';
import QuestionInputCard from '../components/ask/QuestionInputCard';
import AnswerCard from '../components/ask/AnswerCard';
import FollowUpCard from '../components/ask/FollowUpCard';
import SourcesPanel from '../components/ask/SourcesPanel';
import InlineDocumentViewer from '../components/ask/InlineDocumentViewer';
import { useApp } from '../context/AppContext';

export default function AskPage() {
  const { executeAskQuestion } = useApp();
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);

  const exampleQuestions = [
    {
      category: "Safety & Tolerability",
      questions: [
        "What were the most common adverse events reported during the Phase 3 trial of Drug X?",
        "Compare safety profile of Drug X and Drug Y.",
        "Show latest safety updates for Drug X.",
        "What were the discontinuation rates due to adverse events in Study ABC?"
      ]
    },
    {
      category: "Efficacy & Endpoints",
      questions: [
        "Efficacy results in Phase 3",
        "Show efficacy results for Drug Y in Phase 2.",
        "What was the progression-free survival (PFS) hazard ratio in Study ABC?"
      ]
    },
    {
      category: "Labeling & Administration",
      questions: [
        "What is the recommended dosage for Drug X?",
        "Are there hepatic dose adjustments for elderly patients?",
        "What are the known contraindications with CYP3A4 inhibitors?"
      ]
    }
  ];

  const handlePickExample = (q) => {
    executeAskQuestion(q);
    setIsExamplesOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header (matches screenshot 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ask a Question
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Get evidence-based answers from your clinical trial documents.
          </p>
        </div>

        {/* Example Questions Button (matches screenshot 2) */}
        <button
          onClick={() => setIsExamplesOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/15 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 rounded-xl text-xs font-semibold transition-all shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Example Questions</span>
        </button>
      </div>

      {/* Main 2-Column Grid (matches screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input + Answer + Follow-ups */}
        <div className="lg:col-span-7 space-y-6">
          <QuestionInputCard />
          <AnswerCard />
          <FollowUpCard />
        </div>

        {/* Right Column: Sources (3) + Inline Document Viewer */}
        <div className="lg:col-span-5 space-y-6">
          <SourcesPanel />
          <InlineDocumentViewer />
        </div>
      </div>

      {/* Example Questions Modal */}
      <AnimatePresence>
        {isExamplesOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExamplesOpen(false)}
              className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-[#0c1427] border border-slate-700/80 rounded-2xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Example Clinical Queries</h3>
                    <p className="text-xs text-slate-400">Select any prompt to test verified RAG synthesis</p>
                  </div>
                </div>
                <button onClick={() => setIsExamplesOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {exampleQuestions.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-2">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      {group.category}
                    </h4>
                    <div className="space-y-1.5">
                      {group.questions.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handlePickExample(q)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#080d19] hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 text-left text-xs font-medium text-slate-200 hover:text-white transition-all group"
                        >
                          <span className="pr-2">{q}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

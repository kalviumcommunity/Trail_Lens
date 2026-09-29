import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, FileCheck, Bookmark, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Upload Documents",
      description: "Add clinical trial reports, drug labels, or safety bulletins.",
      icon: Upload,
      color: "from-blue-600/30 to-blue-500/10 text-blue-400 border-blue-500/30",
    },
    {
      num: 2,
      title: "Ask Your Question",
      description: "Type a question in natural language.",
      icon: Search,
      color: "from-cyan-600/30 to-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      num: 3,
      title: "Get Evidence-Based Answers",
      description: "Receive accurate answers with exact citations.",
      icon: FileCheck,
      color: "from-purple-600/30 to-purple-500/10 text-purple-400 border-purple-500/30",
    },
    {
      num: 4,
      title: "Save & Share",
      description: "Keep, export, or share answers to support your research.",
      icon: Bookmark,
      color: "from-emerald-600/30 to-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#080d1a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header (matches screenshot 4) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              + HOW TRIALLENS WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From documents to insights<br />in four simple steps.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
            TrialLens uses Retrieval-Augmented Generation (RAG) to provide accurate, evidence-grounded answers with exact citations.
          </p>
        </div>

        {/* 4 Connected Cards Grid (matches screenshot 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="relative p-6 rounded-2xl bg-[#0c1427] border border-slate-800/80 hover:border-blue-500/40 shadow-lg flex flex-col justify-between group transition-all"
              >
                <div className="space-y-4">
                  {/* Step Number Badge + Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center justify-center">
                      {step.num}
                    </div>

                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 pt-2">
                    <h3 className="font-bold text-white text-base tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow connector indicator */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#080d19] border border-slate-800 text-slate-500 flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

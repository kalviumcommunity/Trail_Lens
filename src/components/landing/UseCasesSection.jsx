import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  ShieldAlert,
  Building2,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UseCasesSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const useCases = [
    {
      title: "Clinical Trial Analysis",
      icon: FileText,
      badge: "Trial Operations",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      description: "Instantly parse 300+ page CSRs to extract primary endpoints, adverse event frequencies, subgroup variances, and patient disposition.",
      highlights: [
        "Automated extraction of primary and secondary efficacy endpoints",
        "Subgroup stratification across biomarker cohorts",
        "Direct page citations linked to pivotal statistical report sections"
      ],
      sampleQuery: "What was the median PFS improvement in biomarker-positive subgroup?"
    },
    {
      title: "Drug Safety Research",
      icon: ShieldAlert,
      badge: "Safety Surveillance",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      description: "Monitor safety signals, cross-reference adverse reaction tables, and generate expedited safety reporting summaries for regulatory authorities.",
      highlights: [
        "Continuous screening across annual safety bulletins & MedDRA codes",
        "Incidence comparison against control and comparator drugs",
        "Automatic detection of hepatotoxicity and cardiovascular warning flags"
      ],
      sampleQuery: "What are the common adverse events in Phase 3 of Drug X?"
    },
    {
      title: "Regulatory Research",
      icon: Building2,
      badge: "Regulatory Affairs",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      description: "Accelerate IND and NDA dossiers by tracing labeling statements directly back to pivotal Phase 3 and investigator brochure references.",
      highlights: [
        "Traceability across CTD Module 2.5 and 2.7 clinical summaries",
        "Rapid audit trails for FDA, EMA, and PMDA inquiry responses",
        "Zero hallucination guarantee with strict evidence-only synthesis"
      ],
      sampleQuery: "Verify CTD section 2.5 citations against primary Phase 3 CSR."
    },
    {
      title: "Literature Review",
      icon: TrendingUp,
      badge: "Medical Affairs",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      description: "Synthesize competitive landscape findings, efficacy benchmarks, and safety differentiators across dozens of published reports.",
      highlights: [
        "Side-by-side comparative matrices for competing drug candidates",
        "Meta-synthesis across multiple trial phases and registries",
        "Exportable evidence tables with source citations"
      ],
      sampleQuery: "Compare efficacy and discontinuation rates of Drug X vs Drug Y."
    },
    {
      title: "Pharmacovigilance",
      icon: Activity,
      badge: "Post-Marketing",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      description: "Aggregate post-marketing surveillance reports and real-world evidence registries to track long-term tolerability in global populations.",
      highlights: [
        "Patient-year exposure calculations and adverse event trends",
        "Periodic Benefit-Risk Evaluation Report (PBRER) drafting",
        "Detection of rare adverse signals before scheduled label revisions"
      ],
      sampleQuery: "Show latest pharmacovigilance safety updates for Drug X."
    },
    {
      title: "Medical Research",
      icon: Sparkles,
      badge: "Translational Science",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      description: "Empower translational research teams to interrogate clinical mechanisms of action, pharmacokinetics, and dose-response dynamics.",
      highlights: [
        "Pharmacokinetic Cmax, AUC, and half-life data collation",
        "Dose titration curves and receptor occupancy benchmarks",
        "Streamlined investigator brochure review for grant proposals"
      ],
      sampleQuery: "What is the maximum tolerated dose determined in Phase 1 SAD/MAD?"
    }
  ];

  const current = useCases[activeTab];
  const CurrentIcon = current.icon;

  return (
    <section id="use-cases" className="py-20 bg-[#090e1b]/70 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Tailored Clinical Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for the entire clinical lifecycle.
          </h2>
          <p className="text-sm text-slate-400">
            From first-in-human dose discovery to post-marketing pharmacovigilance surveillance.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {useCases.map((uc, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === idx
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[#0c1427] text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {uc.title}
            </button>
          ))}
        </div>

        {/* Active Use Case Feature Card */}
        <div className="p-8 rounded-2xl bg-[#0c1427] border border-slate-800/80 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left detail */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border ${current.color}`}>
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                    {current.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {current.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigate('/ask')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/30"
                >
                  <span>Explore this use case in TrialLens</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right preview box */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#080d19] border border-slate-800/90 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2.5">
                <span className="font-mono text-blue-400">Sample Clinical Query</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">
                  Instant Output
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#0c1427] border border-slate-700/60 text-xs text-slate-200 font-medium">
                "{current.sampleQuery}"
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Synthesized Evidence:
                </p>
                <div className="p-3 rounded-lg bg-[#0a1020] border border-blue-900/30 text-xs text-slate-200 space-y-2">
                  <p className="leading-relaxed">
                    Grounding confirmed against verified study reports with 99.4% citation alignment.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-blue-300 font-mono">
                    <span>Study_ABC_Phase3.pdf • Page 42</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

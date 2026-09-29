import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Mail,
  Bug,
  BookOpen,
  Send,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
const FAQS = [
  {
    category: "Getting Started",
    question: "What is TrialLens and how does it verify clinical evidence?",
    answer: "TrialLens is an evidence-first clinical research assistant built on advanced Retrieval-Augmented Generation (RAG). Every answer generated is strictly anchored to uploaded clinical study reports, drug labels, and safety bulletins. The system displays direct citations, page numbers, and exact text highlights, completely preventing AI hallucinations."
  },
  {
    category: "Getting Started",
    question: "What document formats are supported for upload?",
    answer: "TrialLens supports PDF (.pdf) and Microsoft Word documents (.docx) up to 250MB per file. Documents are parsed with optical character recognition (OCR) and high-fidelity layout analysis to preserve tables, clinical figures, and appendix sections."
  },
  {
    category: "AI & Citations",
    question: "How does TrialLens calculate source attribution and confidence?",
    answer: "Our pipeline uses dense semantic embeddings and hierarchical chunking. For every claim in the generated answer, TrialLens cross-references the token source against the document index. Citations are ranked by relevance, designating primary study source documents and supporting regulatory disclosures."
  },
  {
    category: "AI & Citations",
    question: "What happens if there is insufficient evidence in the document repository?",
    answer: "Unlike general-purpose conversational LLMs, TrialLens will never invent clinical data. If the answer cannot be verified with high statistical confidence in your uploaded materials, the query is flagged with an 'Insufficient Evidence' badge and an alert explaining which specific data points are missing."
  },
  {
    category: "Privacy & Compliance",
    question: "Is TrialLens compliant with HIPAA, GxP, and 21 CFR Part 11?",
    answer: "Yes. TrialLens is designed for enterprise biopharma compliance. All documents are encrypted at rest (AES-256) and in transit (TLS 1.3). No proprietary clinical trial data is used to train foundation models. Audit logs track every query, answer export, and document access."
  },
  {
    category: "Export & Sharing",
    question: "Can I export answers and citations into clinical study reports?",
    answer: "Yes. You can copy formatted markdown summaries, export structured JSON or CSV data, or generate PDF citation summaries with one-click from the Answer card or the Saved Answers library."
  }
];
import { useApp } from '../context/AppContext';

export default function HelpPage() {
  const { addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Contact support form
  const [supportForm, setSupportForm] = useState({ subject: '', message: '', priority: 'Normal' });
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  // Bug report form
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [bugForm, setBugForm] = useState({ title: '', details: '', step: '' });

  const categories = ['All', 'Getting Started', 'AI & Citations', 'Privacy & Compliance', 'Export & Sharing'];

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportForm.message.trim()) return;
    setIsSubmittingSupport(true);

    setTimeout(() => {
      setIsSubmittingSupport(false);
      setSupportForm({ subject: '', message: '', priority: 'Normal' });
      addToast({
        title: "Support Ticket Created",
        message: "Your inquiry has been assigned ticket #TL-8421. Clinical support responds in < 2 hours.",
        type: "success"
      });
    }, 700);
  };

  const handleBugSubmit = (e) => {
    e.preventDefault();
    setIsBugModalOpen(false);
    setBugForm({ title: '', details: '', step: '' });
    addToast({
      title: "Issue Reported",
      message: "Diagnostic log attached and reported to TrialLens engineering team.",
      type: "info"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Help & Documentation
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Guides, FAQs, and enterprise clinical support for TrialLens intelligence platform.
          </p>
        </div>

        <button
          onClick={() => setIsBugModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <Bug className="w-4 h-4 text-amber-400" />
          <span>Report an Issue</span>
        </button>
      </div>

      {/* Quick Search */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search clinical topics, RAG citations, OCR guidelines..."
          className="w-full bg-[#0c1427] border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xl"
        />
      </div>

      {/* FAQ Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#0c1427] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordions */}
      <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-6 shadow-xl space-y-3">
        <h3 className="font-bold text-white text-base tracking-tight mb-2">
          Frequently Asked Questions ({filteredFaqs.length})
        </h3>

        {filteredFaqs.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No questions found matching your search.</p>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-3.5">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors gap-3"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-blue-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-slate-300 leading-relaxed pt-3 pr-6">
                          {faq.answer}
                        </p>
                        <div className="mt-2 text-[10px] text-blue-400 font-medium">
                          Category: {faq.category}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2-Column: Documentation Guides & Direct Support Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Guides */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0c1427] border border-slate-800/80 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-sm">Documentation Guides</h3>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Retrieval-Augmented Generation in Clinical Trials",
                desc: "How TrialLens achieves 99.4% factual accuracy without hallucinating.",
                tag: "Technical Whitepaper"
              },
              {
                title: "Optical Layout Analysis for MedDRA Tables",
                desc: "Best practices for preparing CSR appendices and complex safety tables.",
                tag: "Upload Guide"
              },
              {
                title: "21 CFR Part 11 & GxP Compliance Validation",
                desc: "Regulatory documentation for IQ/OQ/PQ validated environments.",
                tag: "Compliance"
              }
            ].map((g, i) => (
              <div
                key={i}
                onClick={() => addToast({ title: "Opening Documentation", message: `Opening ${g.title}...`, type: "info" })}
                className="p-3.5 rounded-xl bg-[#080d19] hover:bg-slate-800/50 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">{g.tag}</span>
                  <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors mt-0.5">{g.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{g.desc}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0c1427] border border-slate-800/80 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Contact Clinical Support</h3>
          </div>

          <form onSubmit={handleSupportSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Inquiry Subject</label>
              <input
                type="text"
                required
                value={supportForm.subject}
                onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g. Question regarding Study ABC indexing"
                className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Priority Level</label>
              <select
                value={supportForm.priority}
                onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Normal">Normal — General Guidance</option>
                <option value="High">High — Active Submission Deadline</option>
                <option value="Urgent">Urgent — Audit or Inspection</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Message & Details</label>
              <textarea
                rows={3}
                required
                value={supportForm.message}
                onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Describe your inquiry or study protocol specifics..."
                className="w-full bg-[#080d19] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingSupport}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingSupport ? 'Sending Inquiry...' : 'Submit Support Request'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Bug Report Modal */}
      {isBugModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={() => setIsBugModalOpen(false)} />
          <form
            onSubmit={handleBugSubmit}
            className="relative w-full max-w-md bg-[#0c1427] border border-slate-700 rounded-2xl p-6 shadow-2xl z-10 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Report Clinical Interface Issue</h3>
              </div>
              <button type="button" onClick={() => setIsBugModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Issue Title</label>
                <input
                  type="text"
                  required
                  value={bugForm.title}
                  onChange={(e) => setBugForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Table misalignment on Page 42"
                  className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Reproduction Steps</label>
                <textarea
                  rows={3}
                  required
                  value={bugForm.details}
                  onChange={(e) => setBugForm(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="Steps to trigger the issue..."
                  className="w-full bg-[#080d19] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBugModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Send Report
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  Search,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Trash2,
  Sparkles,
  ArrowRight,
  FileCheck,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SavedPage() {
  const { savedAnswers, deleteSavedAnswer, executeAskQuestion, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  const filteredAnswers = savedAnswers.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.drugProduct.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAnswer = (item) => {
    executeAskQuestion(item.question);
    navigate('/ask');
  };

  const handleCopySnippet = (item) => {
    navigator.clipboard?.writeText(`TRIALLENS Evidence Summary\nQuestion: ${item.question}\n\n${item.snippet}\n\nGrounding: ${item.sourceCount} sources verified.`);
    setCopiedId(item.id);
    addToast({
      title: "Summary Copied",
      message: "Answer snippet and citation groundings copied to clipboard.",
      type: "success"
    });
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleShare = (item) => {
    navigator.clipboard?.writeText(window.location.origin + '/ask');
    addToast({
      title: "Citation Link Copied",
      message: "Direct link to saved synthesis copied.",
      type: "success"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Saved Answers</span>
            <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 font-mono px-2.5 py-0.5 rounded-full">
              {savedAnswers.length}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Access, export, and review previously verified clinical answers and citations.
          </p>
        </div>

        <button
          onClick={() => navigate('/ask')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/30 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask New Question</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search saved answers by keyword or drug..."
          className="w-full bg-[#0c1427] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
        />
      </div>

      {/* Saved Answers Cards Grid */}
      {filteredAnswers.length === 0 ? (
        <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">No saved answers found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm ? `No answers match "${searchTerm}".` : "You haven't saved any clinical queries yet. When viewing an answer on the Ask page, click 'Save' to bookmark it here."}
          </p>
          <button
            onClick={() => navigate('/ask')}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <span>Go to Ask a Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {filteredAnswers.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="rounded-2xl bg-[#0c1427] border border-slate-800/80 hover:border-slate-700 p-5 shadow-lg flex flex-col justify-between group transition-all"
              >
                <div className="space-y-3.5">
                  {/* Badges & Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                        {item.drugProduct}
                      </span>
                      {item.phase && (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                          {item.phase}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      Saved {item.savedDate}
                    </span>
                  </div>

                  {/* Question Title */}
                  <h3
                    onClick={() => handleOpenAnswer(item)}
                    className="font-bold text-white text-sm hover:text-blue-400 cursor-pointer transition-colors leading-snug line-clamp-2"
                  >
                    {item.question}
                  </h3>

                  {/* Snippet */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 bg-[#080d19] p-3 rounded-xl border border-slate-800/80">
                    {item.snippet}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified against {item.sourceCount} primary documents</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/70">
                  <button
                    onClick={() => handleOpenAnswer(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg text-xs font-semibold transition-all"
                  >
                    <span>Open in Ask</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopySnippet(item)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Copy summary"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleShare(item)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSavedAnswer(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                      title="Delete saved answer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

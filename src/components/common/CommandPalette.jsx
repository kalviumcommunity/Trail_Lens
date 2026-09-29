import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, HelpCircle, Upload, Bookmark, Settings, ArrowRight, CornerDownLeft, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    documents,
    recentQuestions,
    executeAskQuestion,
    openDocumentViewer
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Static actions
  const quickActions = [
    { id: 'act-ask', title: 'Ask a Clinical Question', category: 'Action', icon: Sparkles, path: '/ask' },
    { id: 'act-upload', title: 'Upload Clinical Documents', category: 'Action', icon: Upload, path: '/upload' },
    { id: 'act-docs', title: 'Browse Document Library', category: 'Action', icon: FileText, path: '/documents' },
    { id: 'act-saved', title: 'View Saved Answers', category: 'Action', icon: Bookmark, path: '/saved' },
    { id: 'act-settings', title: 'System & Research Settings', category: 'Action', icon: Settings, path: '/settings' },
  ];

  // Filtered documents
  const filteredDocs = documents
    .filter(doc => doc.name.toLowerCase().includes(query.toLowerCase()) || doc.drugProduct.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4)
    .map(doc => ({
      id: doc.id,
      title: doc.name,
      subtitle: `${doc.drugProduct} • ${doc.type} • ${doc.phase}`,
      category: 'Document',
      icon: FileText,
      data: doc
    }));

  // Filtered questions
  const filteredQuestions = recentQuestions
    .filter(q => q.question.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .map(q => ({
      id: q.id,
      title: q.question,
      subtitle: `${q.drug} • ${q.status}`,
      category: 'Recent Question',
      icon: HelpCircle,
      data: q
    }));

  // Combined items
  const allItems = query.trim()
    ? [...filteredDocs, ...filteredQuestions, ...quickActions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()))]
    : [...quickActions, ...filteredDocs, ...filteredQuestions];

  const handleSelect = (item) => {
    setIsCommandPaletteOpen(false);
    if (item.category === 'Action') {
      navigate(item.path);
    } else if (item.category === 'Document') {
      openDocumentViewer(item.data.name, 42);
    } else if (item.category === 'Recent Question') {
      executeAskQuestion(item.data.question);
      navigate('/ask');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      } else if (query.trim()) {
        executeAskQuestion(query.trim());
        navigate('/ask');
        setIsCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCommandPaletteOpen(false)}
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="relative w-full max-w-2xl bg-navy-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
            <Search className="w-5 h-5 text-blue-400 shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search documents, studies, drugs, questions, or type a query..."
              className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-white p-1 mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
              ESC to close
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-800/40">
            {allItems.length === 0 ? (
              <div className="py-12 text-center">
                <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No exact matches found for "{query}"</p>
                <button
                  onClick={() => {
                    executeAskQuestion(query);
                    navigate('/ask');
                    setIsCommandPaletteOpen(false);
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask AI Research Assistant "{query}"
                </button>
              </div>
            ) : (
              <div className="py-1">
                {allItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 text-white border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate text-white">{item.title}</p>
                          {item.subtitle && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                          {item.category}
                        </span>
                        {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-navy-950/90 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300">↵</kbd>
                to select
              </span>
            </div>
            <span className="text-blue-400 font-medium flex items-center gap-1">
              TrialLens RAG Search
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

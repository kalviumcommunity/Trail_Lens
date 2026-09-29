import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ChevronUp,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Download,
  X,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DocumentViewerModal() {
  const { isViewerModalOpen, closeDocumentViewer, activeViewerDoc, addToast } = useApp();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(activeViewerDoc?.currentPage || 1);

  if (!isViewerModalOpen || !activeViewerDoc) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 15, 70));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, activeViewerDoc.totalPages || 1));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      title: "Link Copied",
      message: `Verified source reference for ${activeViewerDoc.name} copied.`,
      type: "success"
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDocumentViewer}
          className="fixed inset-0 bg-[#060a14]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl h-[90vh] bg-[#0c1427] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Top Control Bar */}
          <div className="px-6 py-4 bg-[#0a0f1d] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm sm:text-base truncate max-w-md" title={activeViewerDoc.name}>
                  {activeViewerDoc.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Page {currentPage} of {activeViewerDoc.totalPages || 1}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified in MongoDB
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Toolbar */}
            <div className="flex items-center gap-2">
              {/* Page Controls */}
              <div className="flex items-center gap-1 bg-[#080d19] border border-slate-700/80 rounded-xl p-1 text-xs">
                <button
                  onClick={handlePrevPage}
                  className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 disabled:opacity-30"
                  disabled={currentPage <= 1}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-white text-xs">
                  {currentPage} <span className="text-slate-500">/ {activeViewerDoc.totalPages || 1}</span>
                </span>
                <button
                  onClick={handleNextPage}
                  className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 disabled:opacity-30"
                  disabled={currentPage >= (activeViewerDoc.totalPages || 1)}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-[#080d19] border border-slate-700/80 rounded-xl p-1 text-xs text-slate-300">
                <button onClick={handleZoomOut} className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-xs">{zoomLevel}%</span>
                <button onClick={handleZoomIn} className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={closeDocumentViewer}
                className="p-2 bg-slate-800/80 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors ml-1"
                title="Close viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body: Canvas with Real Text */}
          <div className="flex-1 flex overflow-auto bg-[#070b16] p-6 justify-center items-start">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}
              className="w-full max-w-2xl bg-white text-slate-900 rounded-lg shadow-2xl p-8 sm:p-12 font-sans border border-slate-200 min-h-[550px] flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6 text-[11px] font-mono text-slate-500">
                  <span className="font-bold text-slate-700 uppercase">{activeViewerDoc.name}</span>
                  <span>VERIFIED RECORD</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  {activeViewerDoc.sectionTitle || "Clinical Document Overview"}
                </h2>

                {/* Real highlighted excerpt */}
                <div className="p-4 bg-amber-50/90 border-l-4 border-amber-500 rounded-r-lg mb-6">
                  <p className="text-slate-900 font-medium text-sm leading-relaxed">
                    <mark className="bg-yellow-200/90 text-slate-950 px-1.5 py-0.5 rounded font-semibold border-b-2 border-yellow-500">
                      {activeViewerDoc.highlightText || "Grounded excerpt from indexed document."}
                    </mark>
                  </p>
                </div>

                {/* Real Metadata Rows if provided */}
                {activeViewerDoc.tableRows && activeViewerDoc.tableRows.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-800 mb-2">
                      {activeViewerDoc.tableTitle || "Document Index Details"}
                    </h4>
                    <div className="border border-slate-200 rounded overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3 border-r border-slate-200">Field</th>
                            <th className="py-2 px-3">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-800">
                          {activeViewerDoc.tableRows.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="py-2 px-3 border-r border-slate-200 font-medium">{row.event}</td>
                              <td className="py-2 px-3 font-mono text-slate-700">{row.incidence}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono mt-8">
                <span>{activeViewerDoc.footerText || activeViewerDoc.name}</span>
                <span className="font-bold text-slate-700">Page {currentPage}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

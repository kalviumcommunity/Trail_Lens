import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ChevronUp,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Search,
  Download,
  Maximize2,
  ExternalLink,
  X,
  CheckCircle2,
  Bookmark,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DocumentViewerModal() {
  const { isViewerModalOpen, closeDocumentViewer, activeViewerDoc, addToast } = useApp();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(activeViewerDoc?.currentPage || 42);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  if (!isViewerModalOpen || !activeViewerDoc) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 15, 70));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, activeViewerDoc.totalPages || 245));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleDownload = () => {
    addToast({
      title: "Downloading Document",
      message: `Exporting ${activeViewerDoc.name} with highlighted clinical citations...`,
      type: "info"
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      title: "Link Copied",
      message: `Verified source deep link for page ${currentPage} copied to clipboard.`,
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
          className="fixed inset-0 bg-navy-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl h-[90vh] bg-navy-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Top Bar Header */}
          <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-navy-850 border-b border-slate-800 gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <span className="text-[10px] font-black uppercase tracking-wider">PDF</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-sm md:text-base tracking-tight">{activeViewerDoc.name}</h3>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Source Verified
                  </span>
                </div>
                <p className="text-xs text-slate-400">Page {currentPage} of {activeViewerDoc.totalPages || 245}</p>
              </div>
            </div>

            {/* Controls Toolbar */}
            <div className="flex items-center gap-2">
              {/* Page Nav */}
              <div className="flex items-center bg-navy-900 border border-slate-700/70 rounded-lg p-0.5 text-xs text-slate-300">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Previous page"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-medium text-white">
                  {currentPage} <span className="text-slate-500">/ {activeViewerDoc.totalPages || 245}</span>
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= (activeViewerDoc.totalPages || 245)}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Next page"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom */}
              <div className="hidden sm:flex items-center bg-navy-900 border border-slate-700/70 rounded-lg p-0.5 text-xs text-slate-300">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-medium text-slate-300 text-[11px]">{zoomLevel}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={() => setIsSearchActive(!isSearchActive)}
                className={`p-2 rounded-lg border transition-colors ${isSearchActive ? 'bg-blue-600 text-white border-blue-500' : 'bg-navy-900 text-slate-400 hover:text-white border-slate-700/70 hover:bg-slate-800'}`}
                title="Search within document"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-navy-900 text-slate-400 hover:text-white border border-slate-700/70 hover:bg-slate-800 rounded-lg transition-colors"
                title="Download verified PDF"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-navy-900 text-slate-400 hover:text-white border border-slate-700/70 hover:bg-slate-800 rounded-lg transition-colors"
                title="Copy deep citation link"
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

          {/* Search bar inside viewer */}
          {isSearchActive && (
            <div className="px-5 py-2 bg-navy-950 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-4 h-4 text-blue-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find clinical term or statistical parameter..."
                className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none flex-1"
                autoFocus
              />
              <span className="text-[11px] text-slate-400">1 match on page 42</span>
            </div>
          )}

          {/* Body: Left Thumbnails + Main Clinical Page */}
          <div className="flex-1 flex overflow-hidden bg-navy-950">
            {/* Thumbnails Sidebar */}
            <div className="hidden md:flex flex-col gap-3 w-32 p-3 bg-navy-900/90 border-r border-slate-800 overflow-y-auto shrink-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1">Pages</span>
              {[41, 42, 43].map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all text-center ${
                      isActive
                        ? 'bg-blue-600/20 border-2 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-navy-850 hover:bg-slate-800/70 border border-slate-700/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-16 h-20 bg-white rounded shadow-sm p-1.5 flex flex-col justify-between overflow-hidden">
                      <div className="w-full h-1 bg-slate-300 rounded-sm mb-1" />
                      <div className="space-y-1">
                        <div className="w-full h-0.5 bg-slate-200" />
                        <div className="w-4/5 h-0.5 bg-slate-200" />
                        {pageNum === 42 && <div className="w-full h-1 bg-yellow-300 rounded" />}
                        <div className="w-3/4 h-0.5 bg-slate-200" />
                      </div>
                      <div className="w-1/3 h-0.5 bg-slate-300 self-end" />
                    </div>
                    <span className={`text-[11px] font-mono font-medium ${isActive ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
                      {pageNum}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Document View Canvas */}
            <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}
                className="w-full max-w-2xl bg-white text-slate-900 rounded-lg shadow-2xl p-8 sm:p-12 font-sans border border-slate-200 min-h-[750px] flex flex-col justify-between"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6 text-[11px] font-mono text-slate-500">
                    <span>CONFIDENTIAL — CLINICAL STUDY REPORT</span>
                    <span>PROTOCOL ABC-301</span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                    {activeViewerDoc.sectionTitle || "6.3 Adverse Events"}
                  </h2>

                  {/* Clinical paragraph with highlighted evidence citation */}
                  <div className="text-sm leading-relaxed text-slate-700 mb-6 space-y-3">
                    <p>
                      Treatment-emergent adverse events (TEAEs) were monitored continuously from baseline throughout the 52-week double-blind randomized evaluation period. Safety evaluations incorporated physical examinations, 12-lead electrocardiograms, vital sign monitoring, and standardized clinical laboratory panels.
                    </p>

                    <div className="p-3 bg-amber-50/90 border-l-4 border-amber-500 rounded-r-lg">
                      <p className="text-slate-900 font-medium">
                        <mark className="bg-yellow-200/90 text-slate-950 px-1.5 py-0.5 rounded font-semibold border-b-2 border-yellow-500">
                          {activeViewerDoc.highlightText || "The most common adverse events in the Phase 3 trial were nausea (12.4%), headache (10.1%), fatigue (8.7%), diarrhea (6.3%) and upper respiratory tract infection (5.9%)."}
                        </mark>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 italic">
                      The majority of events were assessed as mild-to-moderate (Grade 1 or Grade 2) according to the National Cancer Institute Common Terminology Criteria for Adverse Events (CTCAE v5.0).
                    </p>
                  </div>

                  {/* Summary Table */}
                  <div className="my-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      {activeViewerDoc.tableTitle || "Table 12. Summary of Adverse Events"}
                    </h4>
                    <div className="border border-slate-300 rounded overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                          <tr>
                            <th className="py-2 px-3 border-r border-slate-200">Adverse Event (MedDRA PT)</th>
                            <th className="py-2 px-3 text-right">Incidence (%)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-800">
                          {(activeViewerDoc.tableRows || [
                            { event: "Nausea", incidence: "12.4%" },
                            { event: "Headache", incidence: "10.1%" },
                            { event: "Fatigue", incidence: "8.7%" },
                            { event: "Diarrhea", incidence: "6.3%" },
                            { event: "Upper respiratory tract infection", incidence: "5.9%" }
                          ]).map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                              <td className="py-2 px-3 border-r border-slate-200 font-medium">{row.event}</td>
                              <td className="py-2 px-3 text-right font-mono font-semibold">{row.incidence}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono mt-8">
                  <span>{activeViewerDoc.footerText || "Study ABC — Phase 3 Clinical Trial Report"}</span>
                  <span className="font-bold text-slate-700">{currentPage}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

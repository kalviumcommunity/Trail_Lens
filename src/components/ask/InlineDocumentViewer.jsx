import React, { useState } from 'react';
import {
  FileText,
  ChevronUp,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Search,
  Download,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function InlineDocumentViewer() {
  const { activeViewerDoc, openDocumentViewer, addToast } = useApp();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(activeViewerDoc?.currentPage || 42);

  const doc = activeViewerDoc || {
    name: "Study_ABC_Phase3.pdf",
    currentPage: 42,
    totalPages: 245,
    sectionTitle: "6.3 Adverse Events",
    highlightText: "The most common adverse events in the Phase 3 trial were nausea (12.4%), headache (10.1%), fatigue (8.7%), diarrhea (6.3%) and upper respiratory tract infection (5.9%).",
    tableTitle: "Table 12. Summary of Adverse Events",
    tableRows: [
      { event: "Nausea", incidence: "12.4" },
      { event: "Headache", incidence: "10.1" },
      { event: "Fatigue", incidence: "8.7" },
      { event: "Diarrhea", incidence: "6.3" },
      { event: "Upper respiratory tract infection", incidence: "5.9" }
    ],
    footerText: "Study ABC — Phase 3 Clinical Trial Report",
    pagesThumbnails: [41, 42, 43]
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 80));

  const handleDownload = () => {
    addToast({
      title: "Downloading Verified Report",
      message: `Exporting ${doc.name} with highlighted clinical citations...`,
      type: "info"
    });
  };

  return (
    <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 shadow-lg overflow-hidden flex flex-col">
      {/* Header (matches screenshot 2) */}
      <div className="p-4 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-black uppercase">PDF</span>
          </div>
          <div>
            <h4 className="font-semibold text-white text-xs truncate max-w-[190px]">
              {doc.name}
            </h4>
            <p className="text-[11px] text-slate-400">
              Page {currentPage} of {doc.totalPages || 245}
            </p>
          </div>
        </div>

        <button
          onClick={() => openDocumentViewer(doc.name, currentPage)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
        >
          <span>Open in New Tab</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Viewer Toolbar (matches screenshot 2) */}
      <div className="px-4 py-2 bg-[#080d19] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-slate-300 text-xs">
        {/* Page Nav */}
        <div className="flex items-center gap-1 bg-[#0c1427] border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1 hover:text-white rounded hover:bg-slate-800 disabled:opacity-30"
            disabled={currentPage <= 1}
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, doc.totalPages || 245))}
            className="p-1 hover:text-white rounded hover:bg-slate-800 disabled:opacity-30"
            disabled={currentPage >= (doc.totalPages || 245)}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] text-white">
            {currentPage} <span className="text-slate-500">/ {doc.totalPages || 245}</span>
          </span>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 bg-[#0c1427] border border-slate-800 rounded-lg p-1">
          <button onClick={handleZoomOut} className="p-1 hover:text-white rounded hover:bg-slate-800">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] text-slate-300">{zoomLevel}%</span>
          <button onClick={handleZoomIn} className="p-1 hover:text-white rounded hover:bg-slate-800">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => addToast({ title: "Clinical Search", message: "Searching within current study report...", type: "info" })}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openDocumentViewer(doc.name, currentPage)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Document Body: Thumbnails + Paper Canvas */}
      <div className="flex overflow-hidden max-h-[460px] bg-[#070b16]">
        {/* Left Thumbnails (matches screenshot 2: 41, 42, 43) */}
        <div className="w-16 p-2 bg-[#090f1f] border-r border-slate-800/80 flex flex-col gap-2.5 items-center shrink-0 overflow-y-auto">
          {[41, 42, 43].map((pageNum) => {
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? 'scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-10 h-14 bg-white rounded shadow p-1 flex flex-col justify-between overflow-hidden border ${
                    isActive ? 'border-2 border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300'
                  }`}
                >
                  <div className="w-full h-1 bg-slate-300 rounded-sm" />
                  <div className="space-y-0.5">
                    <div className="w-full h-0.5 bg-slate-200" />
                    {pageNum === 42 && <div className="w-full h-1 bg-yellow-300 rounded" />}
                    <div className="w-3/4 h-0.5 bg-slate-200" />
                  </div>
                  <div className="w-1/2 h-0.5 bg-slate-300 self-end" />
                </div>
                <span className={`text-[10px] font-mono ${isActive ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                  {pageNum}
                </span>
              </button>
            );
          })}
        </div>

        {/* Paper Canvas (exact reproduction of clinical study page) */}
        <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-lg bg-white text-slate-900 rounded shadow-2xl p-6 font-sans border border-slate-200 min-h-[420px] flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <h3 className="text-sm font-bold text-slate-900 mb-2.5">
                {doc.sectionTitle || "6.3 Adverse Events"}
              </h3>

              {/* Highlight Box (matches screenshot 2 yellow highlighted box) */}
              <div className="p-2 bg-yellow-100/90 border border-yellow-300 rounded text-xs text-slate-950 font-medium leading-relaxed mb-4">
                {doc.highlightText || "The most common adverse events in the Phase 3 trial were nausea (12.4%), headache (10.1%), fatigue (8.7%), diarrhea (6.3%) and upper respiratory tract infection (5.9%)."}
              </div>

              {/* Table */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-800 mb-1.5">
                  {doc.tableTitle || "Table 12. Summary of Adverse Events"}
                </h4>
                <div className="border border-slate-300 rounded overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                      <tr>
                        <th className="py-1.5 px-2.5 border-r border-slate-200">Adverse Event</th>
                        <th className="py-1.5 px-2.5 text-right">Incidence (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {(doc.tableRows || [
                        { event: "Nausea", incidence: "12.4" },
                        { event: "Headache", incidence: "10.1" },
                        { event: "Fatigue", incidence: "8.7" },
                        { event: "Diarrhea", incidence: "6.3" },
                        { event: "Upper respiratory tract infection", incidence: "5.9" }
                      ]).map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="py-1.5 px-2.5 border-r border-slate-200 font-medium">{row.event}</td>
                          <td className="py-1.5 px-2.5 text-right font-mono">{row.incidence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono mt-6">
              <span>{doc.footerText || "Study ABC — Phase 3 Clinical Trial Report"}</span>
              <span className="font-bold text-slate-700">{currentPage}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

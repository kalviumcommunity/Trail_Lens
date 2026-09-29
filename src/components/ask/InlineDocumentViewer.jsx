import React, { useState } from 'react';
import {
  FileText,
  ChevronUp,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Download,
  Maximize2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function InlineDocumentViewer() {
  const { activeViewerDoc, openDocumentViewer, addToast } = useApp();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(activeViewerDoc?.currentPage || 1);

  if (!activeViewerDoc) {
    return (
      <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-8 shadow-lg text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-white text-sm">Source Document Preview</h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Ask a question or click on any source citation to inspect the verified text excerpt and section metadata.
        </p>
      </div>
    );
  }

  const doc = activeViewerDoc;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 80));

  const handleDownload = () => {
    addToast({
      title: "Document Reference",
      message: `Selected record: ${doc.name}`,
      type: "info"
    });
  };

  return (
    <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-black uppercase">DOC</span>
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-white text-xs truncate max-w-[190px]" title={doc.name}>
              {doc.name}
            </h4>
            <p className="text-[11px] text-slate-400">
              Page {currentPage} of {doc.totalPages || 1}
            </p>
          </div>
        </div>

        <button
          onClick={() => openDocumentViewer(doc.name, currentPage)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors shrink-0"
        >
          <span>Expand</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Viewer Toolbar */}
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
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, doc.totalPages || 1))}
            className="p-1 hover:text-white rounded hover:bg-slate-800 disabled:opacity-30"
            disabled={currentPage >= (doc.totalPages || 1)}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] text-white">
            {currentPage} <span className="text-slate-500">/ {doc.totalPages || 1}</span>
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
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Citation Info"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openDocumentViewer(doc.name, currentPage)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Document Body */}
      <div className="overflow-auto p-4 flex justify-center items-start bg-[#070b16] max-h-[460px]">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-lg bg-white text-slate-900 rounded shadow-2xl p-6 font-sans border border-slate-200 min-h-[380px] flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="border-b border-slate-200 pb-2 mb-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="truncate max-w-[240px] uppercase font-bold text-slate-700">{doc.name}</span>
              <span>VERIFIED SOURCE</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-2.5">
              {doc.sectionTitle || "Clinical Evidence Excerpt"}
            </h3>

            {/* Highlight Box */}
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r text-xs text-slate-950 font-medium leading-relaxed mb-4">
              {doc.highlightText || "Verified text excerpt corresponding to this clinical citation."}
            </div>

            {/* Table or Metadata */}
            {doc.tableRows && doc.tableRows.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-800 mb-1.5">
                  {doc.tableTitle || "Document Citation Details"}
                </h4>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-1.5 px-2.5 border-r border-slate-200">Property</th>
                        <th className="py-1.5 px-2.5 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {doc.tableRows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="py-1.5 px-2.5 border-r border-slate-200 font-medium">{row.event}</td>
                          <td className="py-1.5 px-2.5 text-right font-mono text-slate-700">{row.incidence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono mt-6">
            <span className="truncate max-w-[200px]">{doc.footerText || doc.name}</span>
            <span className="font-bold text-slate-700">Page {currentPage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

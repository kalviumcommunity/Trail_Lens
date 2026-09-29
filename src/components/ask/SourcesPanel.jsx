import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, ArrowRight, MoreVertical, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SourcesPanel() {
  const { currentAnswer, openDocumentViewer } = useApp();

  const sources = currentAnswer?.sources || [];

  const handleSourceClick = (src) => {
    openDocumentViewer(src.name, src.page);
  };

  return (
    <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <h4 className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
          <span>Sources Consulted</span>
          <span className="text-[11px] font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.2 rounded-full">
            {sources.length}
          </span>
        </h4>
        <NavLink
          to="/documents"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <span>All Documents</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Sources List or Empty State */}
      {sources.length === 0 ? (
        <div className="py-8 px-3 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-300">No sources cited yet</p>
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
            Ask a clinical research question. Any verified trial records used by Google Gemini will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sources.map((src, idx) => (
            <div
              key={src.id || idx}
              onClick={() => handleSourceClick(src)}
              className="flex items-center justify-between p-3 rounded-xl bg-[#080d19] hover:bg-slate-800/60 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Number Circle */}
                <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 group-hover:bg-blue-600 group-hover:text-white text-xs font-bold flex items-center justify-center shrink-0 transition-colors">
                  {idx + 1}
                </div>

                {/* Doc Icon */}
                <div className="w-7 h-7 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-black uppercase">DOC</span>
                </div>

                {/* Title & Section */}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white group-hover:text-blue-400 truncate transition-colors" title={src.name}>
                    {src.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5" title={src.section}>
                    {src.section || 'General'} {src.page ? `• Page ${src.page}` : ''}
                  </p>
                </div>
              </div>

              {/* Primary Source Badge + 3-dots */}
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {src.isPrimary && (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Primary
                  </span>
                )}
                {src.relevance_score && (
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                    {Math.round(src.relevance_score * 100)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

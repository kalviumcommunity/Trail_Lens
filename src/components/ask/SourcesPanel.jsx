import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, ArrowRight, MoreVertical, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SourcesPanel() {
  const { currentAnswer, openDocumentViewer, setActiveViewerDoc } = useApp();

  const sources = currentAnswer?.sources || [
    {
      id: "src-1",
      name: "Study_ABC_Phase3.pdf",
      section: "Safety Results",
      page: 42,
      isPrimary: true,
      tag: "Primary Source"
    },
    {
      id: "src-2",
      name: "DrugX_Label.pdf",
      section: "Adverse Reactions",
      page: 12,
      isPrimary: false
    },
    {
      id: "src-3",
      name: "Safety_Bulletin_2023.pdf",
      section: "Safety Update",
      page: 8,
      isPrimary: false
    }
  ];

  const handleSourceClick = (src) => {
    openDocumentViewer(src.name, src.page);
  };

  return (
    <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <h4 className="font-bold text-white text-sm tracking-tight">
          Sources ({sources.length})
        </h4>
        <NavLink
          to="/documents"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <span>View All Sources</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Sources List */}
      <div className="space-y-2.5">
        {sources.map((src, idx) => (
          <div
            key={src.id || idx}
            onClick={() => handleSourceClick(src)}
            className="flex items-center justify-between p-3 rounded-xl bg-[#080d19] hover:bg-slate-800/60 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Number Circle (matches screenshot 2: 1, 2, 3) */}
              <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 group-hover:bg-blue-600 group-hover:text-white text-xs font-bold flex items-center justify-center shrink-0 transition-colors">
                {idx + 1}
              </div>

              {/* PDF Icon */}
              <div className="w-7 h-7 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-black uppercase">PDF</span>
              </div>

              {/* Title & Section */}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white group-hover:text-blue-400 truncate transition-colors">
                  {src.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {src.section} • Page {src.page}
                </p>
              </div>
            </div>

            {/* Primary Source Badge + 3-dots */}
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {src.isPrimary && (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Primary Source
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSourceClick(src);
                }}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

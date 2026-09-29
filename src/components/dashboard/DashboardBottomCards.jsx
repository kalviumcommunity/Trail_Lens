import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Upload, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DashboardBottomCards() {
  const { openDocumentViewer } = useApp();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Continue Your Research Card */}
      <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-5 shadow-lg flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-base tracking-tight">Continue Your Research</h3>
          <p className="text-xs text-slate-400 mt-1">Pick up where you left off.</p>

          <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-[#090f1f] border border-slate-800/90">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-black uppercase">PDF</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">Study_ABC_Phase3.pdf</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Last viewed 22 Sep 2026</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openDocumentViewer("Study_ABC_Phase3.pdf", 42)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-400 hover:text-white bg-blue-600/10 hover:bg-blue-600 border border-blue-500/30 rounded-xl transition-all shadow-sm"
            >
              <span>Open</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload New Document Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0c1e28] to-[#0a1523] border border-teal-900/40 p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">Upload New Document</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-sm leading-relaxed">
              Add clinical trial reports, drug labels, or safety bulletins.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-emerald-950/40 shrink-0 whitespace-nowrap"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>
    </div>
  );
}

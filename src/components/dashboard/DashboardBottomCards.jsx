import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Clock, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DashboardBottomCards() {
  const { documents, openDocumentViewer } = useApp();
  const navigate = useNavigate();

  const firstDoc = documents[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Continue Your Research Card */}
      <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-5 shadow-lg flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-base tracking-tight">Active Research Document</h3>
          <p className="text-xs text-slate-400 mt-1">Grounded clinical evidence source in MongoDB.</p>

          {firstDoc ? (
            <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-[#090f1f] border border-slate-800/90">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black uppercase">{firstDoc.fileType || 'DOC'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate" title={firstDoc.name}>
                    {firstDoc.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Uploaded {firstDoc.uploadedOn}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openDocumentViewer(firstDoc.name, 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-400 hover:text-white bg-blue-600/10 hover:bg-blue-600 border border-blue-500/30 rounded-xl transition-all shadow-sm shrink-0 ml-2"
              >
                <span>Open</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl bg-[#090f1f] border border-slate-800/90 text-center">
              <p className="text-xs text-slate-400">No active document yet.</p>
              <button
                onClick={() => navigate('/upload')}
                className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                Upload your first document →
              </button>
            </div>
          )}
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
              Add clinical trial reports, protocols, drug labels, or safety bulletins to MongoDB.
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

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, MoreVertical, Eye, Download, Copy, Check, Upload, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RecentDocumentsCard() {
  const { documents, openDocumentViewer, deleteDocument, addToast } = useApp();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  // Take top 5 recent documents
  const recentList = documents.slice(0, 5);

  const handleCopy = (doc) => {
    navigator.clipboard?.writeText(`${doc.name} - ${doc.drugProduct} (${doc.type})`);
    setCopiedId(doc.id);
    addToast({
      title: "Citation Copied",
      message: `${doc.name} citation reference copied.`,
      type: "success"
    });
    setTimeout(() => setCopiedId(null), 1500);
    setActiveMenuId(null);
  };

  return (
    <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-5 shadow-lg flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base tracking-tight">Recent Documents</h3>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
              {documents.length} in MongoDB
            </span>
          </div>
          <NavLink
            to="/documents"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </div>

        {/* Documents Table or Empty State */}
        {recentList.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">No documents indexed in MongoDB yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Upload clinical trial reports, protocols, or bulletins to begin RAG indexing.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all mt-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Clinical Document</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/60 text-slate-400 font-medium">
                  <th className="py-3 px-2">Document</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Study / Product</th>
                  <th className="py-3 px-2">Chunks</th>
                  <th className="py-3 px-2">Uploaded</th>
                  <th className="py-3 px-1 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {recentList.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => openDocumentViewer(doc.name, 1)}
                  >
                    {/* File Name with extension icon */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-black uppercase">{doc.fileType || 'DOC'}</span>
                        </div>
                        <span className="font-medium text-white group-hover:text-blue-400 transition-colors truncate max-w-[200px]" title={doc.name}>
                          {doc.name}
                        </span>
                      </div>
                    </td>

                    {/* Document Type */}
                    <td className="py-3 px-2 text-slate-300 whitespace-nowrap">
                      {doc.type}
                    </td>

                    {/* Drug / Study */}
                    <td className="py-3 px-2 font-medium text-slate-200">
                      {doc.drugProduct || doc.study_id}
                    </td>

                    {/* Chunks */}
                    <td className="py-3 px-2 text-slate-400 font-mono">
                      {doc.total_chunks || 1}
                    </td>

                    {/* Upload Date */}
                    <td className="py-3 px-2 text-slate-400 whitespace-nowrap">
                      {doc.uploadedOn}
                    </td>

                    {/* 3-Dots Action Menu */}
                    <td className="py-3 px-1 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === doc.id ? null : doc.id)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === doc.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-[#0e172a] border border-slate-700 rounded-xl shadow-2xl p-1 z-30 text-left">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              openDocumentViewer(doc.name, 1);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                            View Document
                          </button>
                          <button
                            onClick={() => handleCopy(doc)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            {copiedId === doc.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            Copy Reference
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              deleteDocument(doc.id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Document
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

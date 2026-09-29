import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, ArrowRight, MoreVertical, Eye, Download, Bookmark, Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RecentDocumentsCard() {
  const { documents, openDocumentViewer, addToast } = useApp();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

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
          <h3 className="font-bold text-white text-base tracking-tight">Recent Documents</h3>
          <NavLink
            to="/documents"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/60 text-slate-400 font-medium">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Drug / Product</th>
                <th className="py-3 px-2">Phase</th>
                <th className="py-3 px-2">Uploaded On</th>
                <th className="py-3 px-1 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {recentList.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => openDocumentViewer(doc.name, 42)}
                >
                  {/* File Name with PDF/Doc icon */}
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black uppercase">PDF</span>
                      </div>
                      <span className="font-medium text-white group-hover:text-blue-400 transition-colors truncate max-w-[170px]">
                        {doc.name}
                      </span>
                    </div>
                  </td>

                  {/* Document Type */}
                  <td className="py-3 px-2 text-slate-300 whitespace-nowrap">
                    {doc.type}
                  </td>

                  {/* Drug Product */}
                  <td className="py-3 px-2 font-medium text-slate-200">
                    {doc.drugProduct}
                  </td>

                  {/* Phase */}
                  <td className="py-3 px-2 text-slate-400">
                    {doc.phase}
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
                            openDocumentViewer(doc.name, 42);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          View Document
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            addToast({
                              title: "Download Started",
                              message: `Downloading ${doc.name}...`,
                              type: "info"
                            });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          Download PDF
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
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

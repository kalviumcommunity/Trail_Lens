import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  Loader2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function UploadPage() {
  const { uploadQueue, addUploadFiles, clearUploadQueue, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("Clinical Trial Report");
  const [selectedDrug, setSelectedDrug] = useState("Drug X");
  const [selectedPhase, setSelectedPhase] = useState("Phase 3");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const categories = [
    "Clinical Trial Report",
    "Drug Label",
    "Safety Bulletin",
    "Investigator Brochure",
    "Regulatory Document"
  ];

  const drugs = ["Drug X", "Drug Y", "Drug Z", "Drug A", "Drug B", "Custom Compound"];
  const phases = ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Pre-clinical"];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addUploadFiles(e.dataTransfer.files, selectedCategory, selectedDrug, selectedPhase);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addUploadFiles(e.target.files, selectedCategory, selectedDrug, selectedPhase);
    }
  };

  // Preset demo upload files
  const handleUploadDemoSample = () => {
    const mockFiles = [
      new File(["sample study data"], "Study_XYZ_Phase3_Interim.pdf", { type: "application/pdf" }),
      new File(["sample safety update"], "Safety_Advisory_Q3_2026.pdf", { type: "application/pdf" })
    ];
    addUploadFiles(mockFiles, selectedCategory, selectedDrug, selectedPhase);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Upload Clinical Documents
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Securely index clinical study reports, drug labels, and safety bulletins into TrialLens RAG repository.
          </p>
        </div>

        <button
          onClick={() => navigate('/documents')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <span>View Library</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metadata Configuration Card */}
      <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-6 shadow-lg space-y-4">
        <h3 className="font-bold text-white text-sm tracking-tight">
          1. Select Document Metadata
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Document Type / Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Document Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Drug Product */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Drug Product</label>
            <select
              value={selectedDrug}
              onChange={(e) => setSelectedDrug(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {drugs.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Study Phase */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Clinical Phase</label>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {phases.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-blue-500 bg-blue-950/30 scale-[1.01]'
            : 'border-slate-700/80 hover:border-blue-500/60 bg-[#0a1020]/70 hover:bg-[#0c1429]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4 shadow-glow-sm">
          <Upload className="w-8 h-8 text-blue-400" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Drag & drop clinical files here
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md leading-relaxed">
          Supports <span className="text-white font-semibold">PDF (.pdf)</span> and <span className="text-white font-semibold">Word (.docx)</span> up to 250MB. Tables, MedDRA charts, and citations are parsed automatically.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all pointer-events-none"
          >
            Browse Local Files
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleUploadDemoSample();
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Upload Demo CSR Sample
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted with AES-256 GxP-compliant vector pipeline</span>
        </div>
      </div>

      {/* Upload Processing Queue */}
      {uploadQueue.length > 0 && (
        <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-sm tracking-tight">
                Upload Queue & Indexing Status ({uploadQueue.length})
              </h3>
            </div>

            <button
              onClick={clearUploadQueue}
              className="text-xs font-medium text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {uploadQueue.map((item) => {
              const isDone = item.status === "Completed";
              const isProcessing = item.status === "Processing";

              return (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black uppercase">
                        {item.fileType === 'docx' ? 'DOC' : 'PDF'}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.type} • {item.drugProduct} • {item.size} • ~{item.pages} pages
                      </p>
                    </div>
                  </div>

                  {/* Progress & Status */}
                  <div className="flex items-center gap-4 sm:w-64 shrink-0">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-400">
                          {isDone ? 'Indexed into RAG' : isProcessing ? 'OCR Parsing Tables...' : `${item.progress}%`}
                        </span>
                        <span className={`font-semibold ${isDone ? 'text-emerald-400' : isProcessing ? 'text-cyan-400' : 'text-blue-400'}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isDone
                              ? 'bg-emerald-500'
                              : isProcessing
                              ? 'bg-cyan-400 animate-pulse'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

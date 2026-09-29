import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, SlidersHorizontal } from 'lucide-react';

export default function DocumentsHeader({ onToggleMobileFilters }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Documents Library
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Browse and search all uploaded clinical documents.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile filter toggle */}
        <button
          onClick={onToggleMobileFilters}
          className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          <span>Filters</span>
        </button>

        {/* Primary + Upload Document button (matches screenshot 1) */}
        <button
          onClick={() => navigate('/upload')}
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Document</span>
        </button>
      </div>
    </div>
  );
}

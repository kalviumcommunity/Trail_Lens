import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { FILTER_COUNTS } from '../../data/mockData';

export default function FilterPanel({
  filters,
  setFilters,
  onApply,
  onClear,
  isMobile = false,
  onCloseMobile
}) {
  const [drugSearch, setDrugSearch] = useState('');
  const [showMoreDrugs, setShowMoreDrugs] = useState(false);

  const toggleDrug = (drugName) => {
    setFilters(prev => {
      const exists = prev.selectedDrugs.includes(drugName);
      return {
        ...prev,
        selectedDrugs: exists
          ? prev.selectedDrugs.filter(d => d !== drugName)
          : [...prev.selectedDrugs, drugName]
      };
    });
  };

  const toggleType = (typeName) => {
    setFilters(prev => {
      const exists = prev.selectedTypes.includes(typeName);
      return {
        ...prev,
        selectedTypes: exists
          ? prev.selectedTypes.filter(t => t !== typeName)
          : [...prev.selectedTypes, typeName]
      };
    });
  };

  const togglePhase = (phaseName) => {
    setFilters(prev => {
      const exists = prev.selectedPhases.includes(phaseName);
      return {
        ...prev,
        selectedPhases: exists
          ? prev.selectedPhases.filter(p => p !== phaseName)
          : [...prev.selectedPhases, phaseName]
      };
    });
  };

  const displayedDrugs = FILTER_COUNTS.drugProducts
    .filter(d => d.name.toLowerCase().includes(drugSearch.toLowerCase()))
    .slice(0, showMoreDrugs ? 10 : 5);

  return (
    <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-5 shadow-lg flex flex-col justify-between h-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base tracking-tight">Filters</h3>
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* 1. Drug Product Filter */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Drug Product
          </label>
          <select
            value={filters.dropdownDrug}
            onChange={(e) => setFilters(prev => ({ ...prev, dropdownDrug: e.target.value }))}
            className="w-full bg-[#0a0f1d] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Drug Products</option>
            <option value="Drug X">Drug X</option>
            <option value="Drug Y">Drug Y</option>
            <option value="Drug Z">Drug Z</option>
            <option value="Drug A">Drug A</option>
            <option value="Drug B">Drug B</option>
          </select>

          {/* Quick Drug Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={drugSearch}
              onChange={(e) => setDrugSearch(e.target.value)}
              placeholder="Search drug..."
              className="w-full bg-[#080d19] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Drug Checkboxes */}
          <div className="space-y-1.5 pt-1">
            {displayedDrugs.map((drug) => {
              const isChecked = filters.selectedDrugs.includes(drug.name);
              return (
                <label
                  key={drug.name}
                  className="flex items-center justify-between py-1 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDrug(drug.name)}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span>{drug.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">({drug.count})</span>
                </label>
              );
            })}

            <button
              type="button"
              onClick={() => setShowMoreDrugs(!showMoreDrugs)}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium pt-1 flex items-center gap-1"
            >
              <span>{showMoreDrugs ? 'Show less' : 'Show more'}</span>
              {showMoreDrugs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* 2. Document Type Filter */}
        <div className="space-y-2.5 pt-1 border-t border-slate-800/80">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mt-3">
            Document Type
          </label>
          <select
            value={filters.dropdownType}
            onChange={(e) => setFilters(prev => ({ ...prev, dropdownType: e.target.value }))}
            className="w-full bg-[#0a0f1d] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Document Types</option>
            <option value="Clinical Trial Report">Clinical Trial Report</option>
            <option value="Drug Label">Drug Label</option>
            <option value="Safety Bulletin">Safety Bulletin</option>
            <option value="Investigator Brochure">Investigator Brochure</option>
            <option value="Regulatory Document">Regulatory Document</option>
          </select>

          <div className="space-y-1.5 pt-1">
            {FILTER_COUNTS.documentTypes.slice(0, 5).map((type) => {
              const isChecked = filters.selectedTypes.includes(type.name);
              return (
                <label
                  key={type.name}
                  className="flex items-center justify-between py-1 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleType(type.name)}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="truncate max-w-[170px]">{type.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">({type.count})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. Study Phase Filter */}
        <div className="space-y-2.5 pt-1 border-t border-slate-800/80">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mt-3">
            Study Phase
          </label>
          <select
            value={filters.dropdownPhase}
            onChange={(e) => setFilters(prev => ({ ...prev, dropdownPhase: e.target.value }))}
            className="w-full bg-[#0a0f1d] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Phases</option>
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
            <option value="Phase 3">Phase 3</option>
            <option value="Phase 4">Phase 4</option>
          </select>

          <div className="space-y-1.5 pt-1">
            {FILTER_COUNTS.studyPhases.slice(0, 4).map((phase) => {
              const isChecked = filters.selectedPhases.includes(phase.name);
              return (
                <label
                  key={phase.name}
                  className="flex items-center justify-between py-1 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePhase(phase.name)}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span>{phase.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">({phase.count})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 4. Year */}
        <div className="space-y-2.5 pt-1 border-t border-slate-800/80">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mt-3">
            Year
          </label>
          <select
            value={filters.dropdownYear}
            onChange={(e) => setFilters(prev => ({ ...prev, dropdownYear: e.target.value }))}
            className="w-full bg-[#0a0f1d] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {FILTER_COUNTS.years.map((yr) => (
              <option key={yr} value={yr === 'All Years' ? 'All' : yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Apply Filters Button (matches screenshot) */}
      <div className="pt-6">
        <button
          type="button"
          onClick={() => {
            onApply();
            if (isMobile && onCloseMobile) onCloseMobile();
          }}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all text-center"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

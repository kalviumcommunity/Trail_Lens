import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FilterPanel({
  filters,
  setFilters,
  onApply,
  onClear,
  isMobile = false,
  onCloseMobile
}) {
  const { documents } = useApp();
  const [drugSearch, setDrugSearch] = useState('');
  const [showMoreDrugs, setShowMoreDrugs] = useState(false);

  // Compute real filter options from indexed documents
  const dynamicFilters = useMemo(() => {
    const drugsMap = {};
    const typesMap = {};
    const phasesMap = {};
    const yearsSet = new Set();

    documents.forEach(doc => {
      const drug = doc.drugProduct || 'Clinical Product';
      drugsMap[drug] = (drugsMap[drug] || 0) + 1;

      const type = doc.type || 'Clinical Document';
      typesMap[type] = (typesMap[type] || 0) + 1;

      const phase = doc.phase || 'Phase 3';
      phasesMap[phase] = (phasesMap[phase] || 0) + 1;

      if (doc.year) yearsSet.add(doc.year);
    });

    return {
      drugProducts: Object.entries(drugsMap).map(([name, count]) => ({ name, count })),
      documentTypes: Object.entries(typesMap).map(([name, count]) => ({ name, count })),
      studyPhases: Object.entries(phasesMap).map(([name, count]) => ({ name, count })),
      years: ['All Years', ...Array.from(yearsSet).sort().reverse()]
    };
  }, [documents]);

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

  const displayedDrugs = dynamicFilters.drugProducts
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
            Drug / Study Group
          </label>
          <select
            value={filters.dropdownDrug}
            onChange={(e) => setFilters(prev => ({ ...prev, dropdownDrug: e.target.value }))}
            className="w-full bg-[#0a0f1d] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Products & Studies</option>
            {dynamicFilters.drugProducts.map(d => (
              <option key={d.name} value={d.name}>{d.name} ({d.count})</option>
            ))}
          </select>

          {dynamicFilters.drugProducts.length > 0 ? (
            <>
              {/* Quick Drug Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={drugSearch}
                  onChange={(e) => setDrugSearch(e.target.value)}
                  placeholder="Filter by drug..."
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
                        <span className="truncate max-w-[150px]">{drug.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">({drug.count})</span>
                    </label>
                  );
                })}

                {dynamicFilters.drugProducts.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowMoreDrugs(!showMoreDrugs)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium pt-1 flex items-center gap-1"
                  >
                    <span>{showMoreDrugs ? 'Show less' : 'Show more'}</span>
                    {showMoreDrugs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-[11px] text-slate-500 italic">Upload documents to populate filters.</p>
          )}
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
            {dynamicFilters.documentTypes.map(t => (
              <option key={t.name} value={t.name}>{t.name} ({t.count})</option>
            ))}
          </select>

          <div className="space-y-1.5 pt-1">
            {dynamicFilters.documentTypes.slice(0, 5).map((type) => {
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
            {dynamicFilters.studyPhases.map(p => (
              <option key={p.name} value={p.name}>{p.name} ({p.count})</option>
            ))}
          </select>
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
            {dynamicFilters.years.map((yr) => (
              <option key={yr} value={yr === 'All Years' ? 'All' : yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Apply Filters Button */}
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

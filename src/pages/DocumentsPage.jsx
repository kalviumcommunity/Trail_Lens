import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import DocumentsHeader from '../components/documents/DocumentsHeader';
import StatCards from '../components/dashboard/StatCards';
import DocumentsTable from '../components/documents/DocumentsTable';
import FilterPanel from '../components/documents/FilterPanel';
import { useApp } from '../context/AppContext';

export default function DocumentsPage() {
  const { documents, addToast } = useApp();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter state
  const initialFilters = {
    search: '',
    dropdownDrug: 'All',
    dropdownType: 'All',
    dropdownPhase: 'All',
    dropdownYear: 'All',
    selectedDrugs: [],
    selectedTypes: [],
    selectedPhases: []
  };

  const [filters, setFilters] = useState(initialFilters);

  // Filter logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Search term
      if (filters.search.trim()) {
        const term = filters.search.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(term);
        const matchDrug = doc.drugProduct.toLowerCase().includes(term);
        const matchType = doc.type.toLowerCase().includes(term);
        if (!matchName && !matchDrug && !matchType) return false;
      }

      // Dropdown drug
      if (filters.dropdownDrug !== 'All' && doc.drugProduct !== filters.dropdownDrug) {
        return false;
      }

      // Dropdown type
      if (filters.dropdownType !== 'All' && doc.type !== filters.dropdownType) {
        return false;
      }

      // Dropdown phase
      if (filters.dropdownPhase !== 'All' && doc.phase !== filters.dropdownPhase) {
        return false;
      }

      // Dropdown year
      if (filters.dropdownYear !== 'All' && doc.year !== filters.dropdownYear) {
        return false;
      }

      // Selected drugs checkboxes
      if (filters.selectedDrugs.length > 0 && !filters.selectedDrugs.includes(doc.drugProduct)) {
        return false;
      }

      // Selected types checkboxes
      if (filters.selectedTypes.length > 0 && !filters.selectedTypes.includes(doc.type)) {
        return false;
      }

      // Selected phases checkboxes
      if (filters.selectedPhases.length > 0 && !filters.selectedPhases.includes(doc.phase)) {
        return false;
      }

      return true;
    });
  }, [documents, filters]);

  const handleApplyFilters = () => {
    addToast({
      title: "Filters Applied",
      message: `Displaying ${filteredDocuments.length} matching clinical documents.`,
      type: "info"
    });
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    addToast({
      title: "Filters Reset",
      message: "Showing all 120 clinical documents.",
      type: "info"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <DocumentsHeader onToggleMobileFilters={() => setIsMobileFilterOpen(true)} />

      {/* 4 Stat Cards */}
      <StatCards showChanges={false} />

      {/* Main Grid: Table (Left) + Filter Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Table Column (Matches Screenshot 1) */}
        <div className="lg:col-span-9">
          <DocumentsTable
            documentsList={filteredDocuments}
            filters={filters}
            setFilters={setFilters}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right Filter Column (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-20">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilters}
            onClear={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Drawer Filter Panel */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] h-full bg-[#0c1427] border-l border-slate-800 p-5 z-10 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="font-bold text-white text-base">Filter Library</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onApply={handleApplyFilters}
                onClear={handleResetFilters}
                isMobile={true}
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

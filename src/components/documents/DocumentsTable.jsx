import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  ArrowUpDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Trash2,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DocumentsTable({
  documentsList,
  filters,
  setFilters,
  onResetFilters
}) {
  const { openDocumentViewer, deleteDocument, addToast } = useApp();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState('uploadedOn');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting
  const sortedDocs = [...documentsList].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      const cmp = aVal.localeCompare(bVal);
      return sortOrder === 'asc' ? cmp : -cmp;
    }
    return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  // Pagination calculation
  const totalCount = 120; // Exact match to screenshot "Showing 1-10 of 120 documents"
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocs = sortedDocs.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedDocs.map(d => d.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCopyCitation = (doc) => {
    navigator.clipboard?.writeText(`${doc.name} - ${doc.drugProduct} (${doc.type}, ${doc.year})`);
    addToast({
      title: "Citation Copied",
      message: `${doc.name} metadata copied.`,
      type: "success"
    });
    setActiveMenuId(null);
  };

  const handleDownload = (doc) => {
    addToast({
      title: "Downloading File",
      message: `Exporting ${doc.name}...`,
      type: "info"
    });
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Toolbar (Matches screenshot 1) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c1427] border border-slate-800/80 p-3 rounded-2xl shadow-lg">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search documents by name, keyword, or content..."
            className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Dropdowns Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Drug Products Dropdown */}
          <select
            value={filters.dropdownDrug}
            onChange={(e) => setFilters(prev => ({ ...prev, dropdownDrug: e.target.value }))}
            className="bg-[#080d19] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Drug Products</option>
            <option value="Drug X">Drug X</option>
            <option value="Drug Y">Drug Y</option>
            <option value="Drug Z">Drug Z</option>
            <option value="Drug A">Drug A</option>
            <option value="Drug B">Drug B</option>
          </select>

          {/* Document Types Dropdown */}
          <select
            value={filters.dropdownType}
            onChange={(e) => setFilters(prev => ({ ...prev, dropdownType: e.target.value }))}
            className="bg-[#080d19] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Document Types</option>
            <option value="Clinical Trial Report">Clinical Trial Report</option>
            <option value="Drug Label">Drug Label</option>
            <option value="Safety Bulletin">Safety Bulletin</option>
            <option value="Investigator Brochure">Investigator Brochure</option>
            <option value="Regulatory Document">Regulatory Document</option>
          </select>

          {/* Phases Dropdown */}
          <select
            value={filters.dropdownPhase}
            onChange={(e) => setFilters(prev => ({ ...prev, dropdownPhase: e.target.value }))}
            className="bg-[#080d19] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Phases</option>
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
            <option value="Phase 3">Phase 3</option>
            <option value="Phase 4">Phase 4</option>
          </select>

          {/* Years Dropdown */}
          <select
            value={filters.dropdownYear}
            onChange={(e) => setFilters(prev => ({ ...prev, dropdownYear: e.target.value }))}
            className="bg-[#080d19] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Years</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
          </select>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="bg-[#080d19] border-b border-slate-800/80 text-slate-400 select-none">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedDocs.length > 0 && selectedIds.length === paginatedDocs.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-3 font-semibold hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    <span>Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('type')}
                  className="py-3.5 px-3 font-semibold hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    <span>Type</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('drugProduct')}
                  className="py-3.5 px-3 font-semibold hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    <span>Drug Product</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('phase')}
                  className="py-3.5 px-3 font-semibold hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    <span>Phase</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('year')}
                  className="py-3.5 px-3 font-semibold hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    <span>Year</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pages')}
                  className="py-3.5 px-3 font-semibold hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    <span>Pages</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('uploadedOn')}
                  className="py-3.5 px-3 font-semibold hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    <span>Uploaded On</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {paginatedDocs.map((doc) => {
                const isSelected = selectedIds.includes(doc.id);
                const isDocx = doc.fileType === 'docx';

                return (
                  <tr
                    key={doc.id}
                    className={`hover:bg-slate-800/35 transition-colors ${
                      isSelected ? 'bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(doc.id)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                    </td>

                    {/* File Name with PDF/Doc icon */}
                    <td className="py-3.5 px-3 font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border ${
                            isDocx
                              ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          <span className="text-[9px] font-black uppercase">
                            {isDocx ? 'DOC' : 'PDF'}
                          </span>
                        </div>
                        <span className="truncate max-w-[200px] hover:text-blue-400 cursor-pointer" onClick={() => openDocumentViewer(doc.name, 42)}>
                          {doc.name}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                      {doc.type}
                    </td>

                    {/* Drug Product */}
                    <td className="py-3.5 px-3 text-slate-200 font-medium">
                      {doc.drugProduct}
                    </td>

                    {/* Phase */}
                    <td className="py-3.5 px-3 text-slate-400">
                      {doc.phase}
                    </td>

                    {/* Year */}
                    <td className="py-3.5 px-3 text-slate-400 font-mono">
                      {doc.year}
                    </td>

                    {/* Pages */}
                    <td className="py-3.5 px-3 text-slate-400 font-mono">
                      {doc.pages}
                    </td>

                    {/* Uploaded On */}
                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                      {doc.uploadedOn}
                    </td>

                    {/* Actions: View Button + 3-dots */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 relative">
                        {/* View Button (matches screenshot 1) */}
                        <button
                          onClick={() => openDocumentViewer(doc.name, 42)}
                          className="px-3 py-1 bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg text-xs font-semibold transition-all shadow-sm"
                        >
                          View
                        </button>

                        {/* 3-dots dropdown */}
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === doc.id ? null : doc.id)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
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
                              onClick={() => handleDownload(doc)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-400" />
                              Download
                            </button>
                            <button
                              onClick={() => handleCopyCitation(doc)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              Copy Citation
                            </button>
                            <div className="border-t border-slate-800 my-1 pt-1">
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  deleteDocument(doc.id);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (matches screenshot 1: "Showing 1-10 of 120 documents", < 1 2 3 4 5 ... 12 >) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-[#080d19] border-t border-slate-800/80 text-xs text-slate-400">
          <div>
            Showing <span className="text-white font-medium">{startIndex + 1}</span>-
            <span className="text-white font-medium">{Math.min(startIndex + itemsPerPage, totalCount)}</span> of{' '}
            <span className="text-white font-medium">{totalCount}</span> documents
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number buttons */}
            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <span className="px-1 text-slate-600">...</span>

            <button
              onClick={() => setCurrentPage(12)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                currentPage === 12
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              12
            </button>

            {/* Next button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, 12))}
              disabled={currentPage === 12}
              className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

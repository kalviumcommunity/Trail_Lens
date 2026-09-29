import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FlaskConical, Layers, Shield, Database } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StatCards({ showChanges = true }) {
  const { documents } = useApp();

  const totalDocuments = documents.length;
  const uniqueStudies = new Set(documents.map(d => d.study_id).filter(Boolean)).size;
  const totalChunks = documents.reduce((acc, d) => acc + (d.total_chunks || 0), 0);
  const safetyBulletins = documents.filter(d =>
    (d.type || '').toLowerCase().includes('bulletin') || (d.type || '').toLowerCase().includes('safety')
  ).length;

  const stats = [
    {
      label: "Indexed Documents",
      shortLabel: "Documents",
      value: totalDocuments,
      change: totalDocuments > 0 ? "Real-time in MongoDB" : "No documents yet",
      icon: FileText,
      iconBg: "bg-blue-600/20 text-blue-400 border border-blue-500/30",
    },
    {
      label: "Active Studies",
      shortLabel: "Studies",
      value: uniqueStudies,
      change: uniqueStudies > 0 ? `${uniqueStudies} study group(s)` : "Upload to add",
      icon: FlaskConical,
      iconBg: "bg-purple-600/20 text-purple-400 border border-purple-500/30",
    },
    {
      label: "Vector Chunks",
      shortLabel: "Chunks",
      value: totalChunks,
      change: totalChunks > 0 ? "Indexed for Gemini RAG" : "Empty index",
      icon: Layers,
      iconBg: "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30",
    },
    {
      label: "Safety Bulletins",
      shortLabel: "Safety",
      value: safetyBulletins,
      change: safetyBulletins > 0 ? "Clinical safety files" : "0 indexed",
      icon: Shield,
      iconBg: "bg-amber-600/20 text-amber-400 border border-amber-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="relative overflow-hidden rounded-2xl bg-[#0c1427] border border-slate-800/80 hover:border-slate-700 p-5 shadow-lg flex items-center gap-4 group transition-all"
          >
            <div className={`p-3.5 rounded-xl ${stat.iconBg} shrink-0 group-hover:scale-105 transition-transform`}>
              <Icon className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-400 truncate">
                {stat.label}
              </p>
              {showChanges && (
                <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-blue-400 truncate">
                  <Database className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{stat.change}</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

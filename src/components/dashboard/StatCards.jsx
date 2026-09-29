import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FlaskConical, Pill, Shield, TrendingUp } from 'lucide-react';
import { STATS_DATA } from '../../data/mockData';

export default function StatCards({ showChanges = true }) {
  const stats = [
    {
      label: "Total Documents",
      shortLabel: "Documents",
      value: STATS_DATA.totalDocuments,
      change: STATS_DATA.totalDocumentsChange,
      icon: FileText,
      iconBg: "bg-blue-600/20 text-blue-400 border border-blue-500/30",
      accent: "from-blue-500/10 to-transparent",
    },
    {
      label: "Studies",
      shortLabel: "Studies",
      value: STATS_DATA.studies,
      change: STATS_DATA.studiesChange,
      icon: FlaskConical,
      iconBg: "bg-purple-600/20 text-purple-400 border border-purple-500/30",
      accent: "from-purple-500/10 to-transparent",
    },
    {
      label: "Drug Products",
      shortLabel: "Drug Products",
      value: STATS_DATA.drugProducts,
      change: STATS_DATA.drugProductsChange,
      icon: Pill,
      iconBg: "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30",
      accent: "from-emerald-500/10 to-transparent",
    },
    {
      label: "Safety Bulletins",
      shortLabel: "Safety Bulletins",
      value: STATS_DATA.safetyBulletins,
      change: STATS_DATA.safetyBulletinsChange,
      icon: Shield,
      iconBg: "bg-amber-600/20 text-amber-400 border border-amber-500/30",
      accent: "from-amber-500/10 to-transparent",
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
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-400 truncate">
                {stat.label}
              </p>
              {showChanges && stat.change && (
                <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

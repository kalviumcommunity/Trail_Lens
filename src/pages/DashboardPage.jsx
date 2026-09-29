import React from 'react';
import { motion } from 'framer-motion';
import DashboardHero from '../components/dashboard/DashboardHero';
import StatCards from '../components/dashboard/StatCards';
import RecentDocumentsCard from '../components/dashboard/RecentDocumentsCard';
import RecentQuestionsCard from '../components/dashboard/RecentQuestionsCard';
import DashboardBottomCards from '../components/dashboard/DashboardBottomCards';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const { userProfile } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-7"
    >
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Welcome back, {userProfile.name.split(' ')[0]}! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Find trusted answers from your clinical trial documents.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs sm:text-sm font-semibold text-slate-300">
            Mon, 22 Sep 2026
          </p>
          <p className="text-xs text-blue-400 font-medium">
            Let's accelerate evidence-based research.
          </p>
        </div>
      </div>

      {/* Ask a research question Hero banner */}
      <DashboardHero />

      {/* 4 Stat Cards */}
      <StatCards showChanges={true} />

      {/* 2-Column: Recent Documents & Recent Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecentDocumentsCard />
        </div>
        <div className="lg:col-span-5">
          <RecentQuestionsCard />
        </div>
      </div>

      {/* Bottom Section: Continue Your Research + Upload New Document */}
      <DashboardBottomCards />
    </motion.div>
  );
}

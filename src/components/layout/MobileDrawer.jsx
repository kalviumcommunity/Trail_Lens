import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Upload,
  Bookmark,
  Settings,
  HelpCircle,
  Quote,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MobileDrawer() {
  const { mobileNavOpen, setMobileNavOpen } = useApp();
  const location = useLocation();

  if (!mobileNavOpen) return null;

  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Ask a Question', path: '/ask', icon: MessageSquare },
    { name: 'Upload', path: '/upload', icon: Upload },
    { name: 'Saved Answers', path: '/saved', icon: Bookmark },
  ];

  const bottomNav = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help & Support', path: '/help', icon: HelpCircle },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 lg:hidden flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm"
        />

        {/* Drawer content */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-72 max-w-[85vw] h-full bg-[#090e1b] border-r border-slate-800 p-5 flex flex-col justify-between z-10 overflow-y-auto"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <NavLink to="/" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-0.5 shadow-glow-sm flex items-center justify-center">
                  <div className="w-full h-full bg-[#0a1022] rounded-[10px] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 relative">
                      <div className="w-1 h-1 rounded-full bg-cyan-300 absolute inset-0 m-auto" />
                    </div>
                  </div>
                </div>
                <span className="font-extrabold text-white text-base tracking-wider font-mono">
                  TRIALLENS
                </span>
              </NavLink>

              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slogan */}
            <div className="px-1 py-3 text-xs text-slate-400 font-sans">
              <p>Ask questions. Find evidence.</p>
              <p className="text-slate-200 font-medium">Trust the source.</p>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1.5 mt-2">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="my-4 border-t border-slate-800" />

            <nav className="space-y-1.5">
              {bottomNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quote Card */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="p-3.5 rounded-xl bg-navy-850 border border-blue-900/40">
              <Quote className="w-4 h-4 text-blue-400 mb-1 opacity-80" />
              <p className="text-xs text-slate-300 italic font-serif">
                "Evidence-first research for a healthier tomorrow."
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mt-3">
              <span>TRIALLENS</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

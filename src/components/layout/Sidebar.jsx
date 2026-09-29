import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Upload,
  Bookmark,
  Settings,
  HelpCircle,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  const location = useLocation();

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
    <aside
      className={`fixed top-0 left-0 h-screen z-30 flex flex-col justify-between bg-[#090e1b] border-r border-[#1a233a] transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4">
        {/* Logo and App Header */}
        <div className="flex items-center justify-between pb-3">
          <NavLink to="/" className="flex items-center gap-3 group">
            {/* Logo Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-0.5 shadow-glow-sm flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0a1022] rounded-[10px] flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-0.5 bg-blue-400 rotate-45 rounded-full" />
                </div>
              </div>
            </div>

            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-wider font-mono">
                  TRIALLENS
                </span>
              </div>
            )}
          </NavLink>

          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Brand Mission Tagline (visible when expanded) */}
        {!sidebarCollapsed && (
          <div className="px-1 py-1 mb-4 text-[11px] leading-snug text-slate-400 font-sans tracking-wide">
            <p>Ask questions.</p>
            <p>Find evidence.</p>
            <p className="text-slate-300 font-medium">Trust the source.</p>
          </div>
        )}

        {/* Main Navigation Links */}
        <nav className="space-y-1.5 mt-2">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                }
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`} />
                {!sidebarCollapsed && <span>{item.name}</span>}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-5 border-t border-slate-800/80" />

        {/* Secondary Links (Settings, Help) */}
        <nav className="space-y-1.5">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                }
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`} />
                {!sidebarCollapsed && <span>{item.name}</span>}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 shrink-0 space-y-4">
        {/* Quote Card (matches screenshots 1, 2, 3) */}
        {!sidebarCollapsed && (
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#0c1833] via-[#0b1429] to-[#080d1b] border border-blue-900/40 shadow-inner">
            {/* Subtle blue wave backdrop decoration */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
            <div className="absolute -left-4 top-0 w-16 h-16 rounded-full bg-cyan-500/5 blur-lg pointer-events-none" />

            <div className="flex items-start gap-2.5 mb-2 relative z-10">
              <Quote className="w-5 h-5 text-blue-400 shrink-0 opacity-80" />
            </div>
            <p className="text-xs text-slate-300 italic font-serif leading-relaxed relative z-10">
              "Evidence-first research for a healthier tomorrow."
            </p>
            <div className="w-6 h-0.5 bg-blue-500/60 rounded-full mt-3" />
          </div>
        )}

        {/* Version Footer */}
        <div className={`flex items-center justify-between text-xs text-slate-400 font-mono pt-1 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          {!sidebarCollapsed && <span className="font-semibold text-slate-300">TRIALLENS</span>}
          <span className="text-[11px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}

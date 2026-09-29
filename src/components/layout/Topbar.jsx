import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Settings,
  HelpCircle,
  LogOut,
  CheckCircle,
  FileCheck,
  ShieldAlert,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Topbar() {
  const {
    sidebarCollapsed,
    setMobileNavOpen,
    setIsCommandPaletteOpen,
    userProfile,
    notifications,
    setNotifications,
    setIsLogoutModalOpen,
    executeAskQuestion
  } = useApp();

  const [searchVal, setSearchVal] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      executeAskQuestion(searchVal.trim());
      navigate('/ask');
      setSearchVal('');
    } else {
      setIsCommandPaletteOpen(true);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-[#090e1b]/90 backdrop-blur-md border-b border-[#1a233a] flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
        sidebarCollapsed ? 'left-20' : 'left-0 lg:left-64'
      }`}
    >
      {/* Left side: Mobile menu toggle + Global Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (matches screenshot) */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onClick={() => {
                if (!searchVal) setIsCommandPaletteOpen(true);
              }}
              placeholder="Search documents, studies, drugs, or keywords..."
              className="w-full bg-[#0b1224] text-slate-100 placeholder-slate-400 text-sm pl-10 pr-20 py-2 rounded-xl border border-slate-700/60 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
            />
            {/* Ctrl + K Shortcut Button */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="absolute right-2 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-400 bg-slate-800/80 hover:bg-slate-700 hover:text-slate-200 border border-slate-700 rounded-md transition-colors"
            >
              Ctrl + K
            </button>
          </div>
        </form>
      </div>

      {/* Right side: Notifications + User Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-4">
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/70 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#090e1b]" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0c1427] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-blue-600 text-white font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-slate-800/40 transition-colors flex gap-3 ${
                      !n.read ? 'bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      {n.type === 'success' ? <FileCheck className="w-4 h-4 text-emerald-400" /> : <Bell className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{n.description}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2.5 bg-[#0a0f1d] border-t border-slate-800 text-center">
                <span className="text-[11px] text-slate-400">All clinical alerts are logged & archived</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown (matches screenshot: "JJ" avatar + "Jager Jackson" + "Researcher" + chevron) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors group"
          >
            {/* JJ Circle Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-blue-400/30 group-hover:ring-blue-400 transition-all">
              {userProfile.initials || "JJ"}
            </div>

            {/* User name & role info */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-white tracking-wide">
                {userProfile.name || "Jager Jackson"}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {userProfile.role || "Researcher"}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0c1427] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2.5 border-b border-slate-800 mb-1">
                <p className="text-xs font-semibold text-white">{userProfile.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{userProfile.email}</p>
                <span className="inline-block mt-1 text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md font-medium">
                  {userProfile.department || "Oncology Phase 3 Development"}
                </span>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Your Profile
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings & Preferences
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/help');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  Help & Documentation
                </button>
              </div>

              <div className="border-t border-slate-800 my-1 pt-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

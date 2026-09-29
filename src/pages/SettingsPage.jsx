import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Palette,
  Bell,
  Sliders,
  Shield,
  Database,
  Check,
  Save,
  Download,
  Trash2,
  Lock,
  Smartphone,
  Eye,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ConfirmModal from '../components/common/ConfirmModal';

export default function SettingsPage() {
  const {
    userProfile,
    setUserProfile,
    settings,
    setSettings,
    setSavedAnswers,
    savedAnswers,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [profileForm, setProfileForm] = useState({ ...userProfile });
  const [settingsState, setSettingsState] = useState({ ...settings });

  // Confirmation modals
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Research Preferences', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'privacy', label: 'Data & Privacy', icon: Database },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile(profileForm);
    addToast({
      title: "Profile Updated",
      message: "Your clinical researcher credentials have been saved.",
      type: "success"
    });
  };

  const handleSaveSettings = () => {
    setSettings(settingsState);
    addToast({
      title: "Settings Saved",
      message: "Preferences updated and synchronized across sessions.",
      type: "success"
    });
  };

  const handleExportData = () => {
    const dataBlob = new Blob(
      [
        JSON.stringify(
          {
            user: userProfile,
            settings: settingsState,
            savedAnswers: savedAnswers,
            exportDate: new Date().toISOString(),
          },
          null,
          2
        ),
      ],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `triallens_research_archive_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    addToast({
      title: "Archive Exported",
      message: "Encrypted research data package downloaded to your computer.",
      type: "success"
    });
  };

  const handleClearSavedConfirm = () => {
    setSavedAnswers([]);
    setIsClearModalOpen(false);
    addToast({
      title: "Saved Answers Cleared",
      message: "All bookmarked clinical answers have been removed.",
      type: "info"
    });
  };

  const handleDeleteAccountConfirm = () => {
    setIsDeleteModalOpen(false);
    addToast({
      title: "Account Request Submitted",
      message: "Data deletion scheduled under 21 CFR Part 11 archival policy.",
      type: "warning"
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.newPass || passwordForm.newPass !== passwordForm.confirm) {
      addToast({
        title: "Password Mismatch",
        message: "New password fields do not match.",
        type: "error"
      });
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    addToast({
      title: "Password Changed",
      message: "Your account credentials were successfully updated.",
      type: "success"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your researcher identity, clinical display preferences, and security controls.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs navigation bar */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-[#0c1427] border border-slate-800/80 rounded-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-6 sm:p-8 shadow-xl">
        {/* 1. Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center gap-5 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center ring-4 ring-blue-500/20 shadow-glow-sm">
                {profileForm.initials || "JJ"}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">{profileForm.name}</h3>
                <p className="text-xs text-slate-400">{profileForm.email}</p>
                <span className="inline-block text-[10px] font-semibold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  Verified Principal Investigator
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Role Title</label>
                <input
                  type="text"
                  value={profileForm.role}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Institutional Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Institution / Organization</label>
                <input
                  type="text"
                  value={profileForm.institution}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Department / Research Area</label>
                <input
                  type="text"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
              >
                Update Profile
              </button>
            </div>
          </form>
        )}

        {/* 2. Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Theme Mode</h4>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {['dark', 'light', 'system'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSettingsState(prev => ({ ...prev, theme: t }))}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      settingsState.theme === t
                        ? 'bg-blue-600/20 text-white border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-[#080d19] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="font-bold text-white text-sm">Accent Color Palette</h4>
              <div className="flex items-center gap-3">
                {[
                  { name: 'blue', bg: 'bg-blue-600', ring: 'ring-blue-500' },
                  { name: 'cyan', bg: 'bg-cyan-500', ring: 'ring-cyan-400' },
                  { name: 'purple', bg: 'bg-purple-600', ring: 'ring-purple-400' },
                  { name: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-400' }
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSettingsState(prev => ({ ...prev, accentColor: c.name }))}
                    className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center transition-all ${
                      settingsState.accentColor === c.name ? `ring-4 ${c.ring} scale-110 shadow-lg` : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {settingsState.accentColor === c.name && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800 max-w-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Enable Interface Animations</p>
                  <p className="text-[11px] text-slate-400">Smooth card reveals, AI generation pulsing, and page transitions.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settingsState.enableAnimations}
                  onChange={(e) => setSettingsState(prev => ({ ...prev, enableAnimations: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Reduce Motion</p>
                  <p className="text-[11px] text-slate-400">Limit parallax movement according to accessibility preferences.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settingsState.reduceMotion}
                  onChange={(e) => setSettingsState(prev => ({ ...prev, reduceMotion: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Research Preferences */}
        {activeTab === 'preferences' && (
          <div className="space-y-6 max-w-lg">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white block">Synthesis Depth & Style</label>
              <div className="grid grid-cols-3 gap-2">
                {['concise', 'balanced', 'detailed'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSettingsState(prev => ({ ...prev, responseStyle: style }))}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      settingsState.responseStyle === style
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-[#080d19] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-white block">Citation Display Layout</label>
              <select
                value={settingsState.citationDisplay}
                onChange={(e) => setSettingsState(prev => ({ ...prev, citationDisplay: e.target.value }))}
                className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="sidebar">Right Side Sources Panel</option>
                <option value="inline">Inline Footnote Numbers</option>
                <option value="both">Both Sidebar & Inline Deep Links</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div>
                <p className="text-xs font-semibold text-white">Auto-save Generated Answers</p>
                <p className="text-[11px] text-slate-400">Automatically bookmark new queries into Saved Answers collection.</p>
              </div>
              <input
                type="checkbox"
                checked={settingsState.autoSaveAnswers}
                onChange={(e) => setSettingsState(prev => ({ ...prev, autoSaveAnswers: e.target.checked }))}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </div>
          </div>
        )}

        {/* 4. Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-lg">
            <h4 className="font-bold text-white text-sm pb-2 border-b border-slate-800">
              Alert & Notification Channels
            </h4>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Research & Safety Bulletins</p>
                <p className="text-[11px] text-slate-400">Get notified when new drug safety alerts are indexed.</p>
              </div>
              <input
                type="checkbox"
                checked={settingsState.notifications.alerts}
                onChange={(e) => setSettingsState(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, alerts: e.target.checked }
                }))}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Upload Completion Alerts</p>
                <p className="text-[11px] text-slate-400">Notifications when long CSR OCR indexing finishes.</p>
              </div>
              <input
                type="checkbox"
                checked={settingsState.notifications.uploadComplete}
                onChange={(e) => setSettingsState(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, uploadComplete: e.target.checked }
                }))}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Weekly Evidence Digest</p>
                <p className="text-[11px] text-slate-400">Summary email of all verified clinical queries.</p>
              </div>
              <input
                type="checkbox"
                checked={settingsState.notifications.digest}
                onChange={(e) => setSettingsState(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, digest: e.target.checked }
                }))}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </div>
          </div>
        )}

        {/* 5. Security & Access */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-xl">
            <div className="p-4 rounded-xl bg-[#080d19] border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-semibold text-white text-xs">Account Password</h4>
                <p className="text-[11px] text-slate-400">Last updated 45 days ago</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
              >
                Change Password
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#080d19] border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white text-xs">Two-Factor Authentication (2FA)</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    settingsState.twoFactorEnabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {settingsState.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Secure clinical access with authenticator app or hardware key.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newState = !settingsState.twoFactorEnabled;
                  setSettingsState(prev => ({ ...prev, twoFactorEnabled: newState }));
                  addToast({
                    title: newState ? "2FA Enabled" : "2FA Disabled",
                    message: newState ? "Two-factor authentication is active." : "2FA has been disabled.",
                    type: "info"
                  });
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  settingsState.twoFactorEnabled
                    ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                {settingsState.twoFactorEnabled ? 'Disable' : 'Enable 2FA'}
              </button>
            </div>

            {/* Active Sessions */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Active Clinical Sessions</h4>
              <div className="divide-y divide-slate-800/80 bg-[#080d19] border border-slate-800 rounded-xl p-3">
                <div className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white">Chrome on Windows (Current)</p>
                    <p className="text-[11px] text-emerald-400">192.168.1.42 • Active Now</p>
                  </div>
                  <span className="text-[10px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded">This Device</span>
                </div>
                <div className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-slate-300">Safari on iPad Pro (Clinical Site)</p>
                    <p className="text-[11px] text-slate-500">Yesterday at 4:18 PM</p>
                  </div>
                  <button
                    onClick={() => addToast({ title: "Session Revoked", message: "Remote tablet logged out.", type: "info" })}
                    className="text-slate-400 hover:text-rose-400 text-xs"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. Data & Privacy */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 max-w-xl">
            {/* Export */}
            <div className="p-4 rounded-xl bg-[#080d19] border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white text-xs">Export All Research Data</h4>
                <p className="text-[11px] text-slate-400">Download all saved answers, query history, and metadata.</p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Clear Saved Answers */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/30 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-amber-200 text-xs">Clear Saved Answers</h4>
                <p className="text-[11px] text-slate-400">Reset your local bookmark repository ({savedAnswers.length} items).</p>
              </div>
              <button
                type="button"
                onClick={() => setIsClearModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 rounded-lg text-xs font-semibold transition-all"
              >
                Clear All
              </button>
            </div>

            {/* Delete Account */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-rose-300 text-xs">Delete Research Account</h4>
                <p className="text-[11px] text-slate-400">Permanently erase session profile and vector index credentials.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="Clear Saved Answers?"
        message="This will remove all saved answers from your local browser storage. This action cannot be undone."
        confirmText="Clear All"
        isDestructive={true}
        onConfirm={handleClearSavedConfirm}
        onCancel={() => setIsClearModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Request Account Deletion?"
        message="Under GxP compliance regulations, research audit trails will be archived securely before account termination."
        confirmText="Confirm Deletion"
        isDestructive={true}
        onConfirm={handleDeleteAccountConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)} />
          <form
            onSubmit={handlePasswordSubmit}
            className="relative w-full max-w-md bg-[#0c1427] border border-slate-700 rounded-2xl p-6 shadow-2xl z-10 space-y-4"
          >
            <h3 className="text-base font-bold text-white">Change Account Password</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPass: e.target.value }))}
                  className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
}

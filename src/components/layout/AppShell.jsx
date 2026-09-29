import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileDrawer from './MobileDrawer';
import ToastContainer from '../common/ToastContainer';
import CommandPalette from '../common/CommandPalette';
import DocumentViewerModal from '../common/DocumentViewerModal';
import ConfirmModal from '../common/ConfirmModal';
import { useApp } from '../../context/AppContext';

export default function AppShell() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const {
    sidebarCollapsed,
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    addToast
  } = useApp();

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    addToast({
      title: "Logged Out",
      message: "You have securely logged out of TrialLens session.",
      type: "info"
    });
  };

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col">
        <ToastContainer />
        <CommandPalette />
        <DocumentViewerModal />
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col">
      {/* Fixed Sidebar for desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Fixed Topbar */}
      <Topbar />

      {/* Main Content Area */}
      <main
        className={`flex-1 pt-16 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </main>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <CommandPalette />
      <DocumentViewerModal />
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Sign Out of TrialLens"
        message="Are you sure you want to end your clinical research session? All saved queries, document indices, and notebooks will remain securely encrypted."
        confirmText="Log Out"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}

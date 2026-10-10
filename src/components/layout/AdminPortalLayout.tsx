import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/navigation/Navbar';
import { Sidebar } from '@/components/navigation/Sidebar';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { OSStatusBar } from '@/components/ui/OSStatusBar';
import { OSDock } from '@/components/ui/OSDock';

export const AdminPortalLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 text-slate-100 transition-colors aurora-background selection:bg-electric-teal/30 selection:text-white">
      {/* Top OS Menu Status Bar */}
      <OSStatusBar />
      <DemoModeBanner />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 flex-1 w-full flex gap-8">
        <Sidebar type="admin" />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      {/* Interactive Liquid Dock */}
      <OSDock />
      <ToastContainer />
    </div>
  );
};

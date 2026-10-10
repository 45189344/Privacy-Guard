import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/navigation/Navbar';
import { Sidebar } from '@/components/navigation/Sidebar';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const UserPortalLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-midnight-950 text-slate-800 dark:text-slate-100 transition-colors">
      <DemoModeBanner />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex gap-8">
        <Sidebar type="user" />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

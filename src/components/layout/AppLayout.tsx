"use client";

import React, { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "sonner";

interface AppLayoutProps {
  children: ReactNode;
  branch?: string;
  onRefresh?: () => void;
}

export default function AppLayout({ children, branch, onRefresh }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Toast notifications */}
      <Toaster position="top-right" richColors />

      {/* Navigation Sidebar (Desktop Stationary + Mobile Drawer) */}
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 w-full min-w-0 md:ml-64 flex flex-col transition-all duration-300">
        <Header
          branch={branch}
          onRefresh={onRefresh}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

"use client";

import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "sonner";

interface AppLayoutProps {
  children: ReactNode;
  branch?: string;
  onRefresh?: () => void;
}

export default function AppLayout({ children, branch, onRefresh }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Toast notifications */}
      <Toaster position="top-right" richColors />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Header branch={branch} onRefresh={onRefresh} />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

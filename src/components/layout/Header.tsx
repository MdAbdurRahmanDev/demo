"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Building,
  ShieldAlert,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Menu,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  onRefresh?: () => void;
  branch?: string;
  onToggleMobileMenu?: () => void;
}

export default function Header({
  onRefresh,
  branch = "Dhaka Head Office",
  onToggleMobileMenu,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    try {
      await fetch("/api/dashboard/stats");
      toast.success("Operational data refreshed");
    } catch {
      // ignore
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left: Mobile Hamburger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo Branding */}
        <div className="flex items-center gap-1.5 md:hidden">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 text-sm">GuardPro</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search guard, NID, employee, client, or site..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Branch Selector Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
          <Building className="w-3.5 h-3.5 text-slate-500" />
          <span>{branch}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Bangladesh Time / Live indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>BST (UTC+6)</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative border border-transparent hover:border-slate-200"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Operational Alerts
                </span>
                <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-xs max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    Late Check-in Detected
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    Guard Jahangir Alam (GP-G-102) checked in 12m late at GPHouse.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">15 minutes ago</span>
                </div>
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Client Payment Received
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    Grameenphone Ltd. paid ৳2,87,700 for November billing.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 sm:pl-2.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              TI
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">Brig. Gen. Tariqul</p>
              <p className="text-[10px] text-slate-500">Super Admin</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">Brig. Gen. (Retd.) Tariqul Islam</p>
                <p className="text-[11px] text-slate-500 truncate">admin@guardpro.com.bd</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold border border-blue-200">
                  Super Admin
                </span>
              </div>
              <div className="py-1 text-xs text-slate-700">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Building className="w-3.5 h-3.5 text-slate-400" /> Company Settings
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-blue-600 font-medium"
                  onClick={() => setShowUserMenu(false)}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Quick Role Switcher
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

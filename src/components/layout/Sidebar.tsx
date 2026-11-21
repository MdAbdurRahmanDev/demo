"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  CalendarDays,
  Clock,
  CalendarOff,
  Banknote,
  Receipt,
  Wallet,
  AlertTriangle,
  Package,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { title: "Main Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Employees", href: "/employees", icon: Users, badge: "12" },
  { title: "Security Guards", href: "/guards", icon: UserCheck, badge: "10", badgeColor: "bg-blue-100 text-blue-700" },
  { title: "Clients & Sites", href: "/clients", icon: Building2, badge: "4" },
  { title: "Duty Roster", href: "/roster", icon: CalendarDays, badge: "Live", badgeColor: "bg-emerald-100 text-emerald-700" },
  { title: "Attendance", href: "/attendance", icon: Clock },
  { title: "Leave Management", href: "/leave", icon: CalendarOff, badge: "1 Req", badgeColor: "bg-amber-100 text-amber-700" },
  { title: "Payroll & Salary", href: "/payroll", icon: Banknote },
  { title: "Billing & Invoices", href: "/invoices", icon: Receipt },
  { title: "Accounts & Finance", href: "/finance", icon: Wallet },
  { title: "Incidents & Complaints", href: "/incidents", icon: AlertTriangle, badge: "Alert", badgeColor: "bg-rose-100 text-rose-700" },
  { title: "Equipment & Inventory", href: "/equipment", icon: Package },
  { title: "Reports & Analytics", href: "/reports", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900">GuardPro</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-200">
                    BD SaaS
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">Security Management</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onMobileClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg md:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="py-3 px-3 overflow-y-auto max-h-[calc(100vh-140px)] space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (onMobileClose) onMobileClose();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          item.badgeColor || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer / User Profile summary */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              HQ
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">Dhaka Head Office</p>
              <p className="text-[11px] text-emerald-600 font-medium">● System Online</p>
            </div>
            <Link
              href="/login"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
              title="Switch User / Logout"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

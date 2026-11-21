"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Users,
  UserCheck,
  ShieldCheck,
  UserX,
  Building2,
  MapPin,
  Banknote,
  TrendingUp,
  AlertCircle,
  Receipt,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        toast.error("Failed to load dashboard statistics");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = data?.stats || {
    totalEmployees: 12,
    activeGuards: 10,
    guardsOnDuty: 5,
    guardsAbsent: 0,
    totalClients: 4,
    activeSites: 5,
    monthlyPayroll: 198000,
    monthlyRevenue: 487700,
    outstandingClientPayments: 446250,
    monthlyExpenses: 398000,
  };

  const financialTrends = data?.financialTrends || [
    { month: "Jun", revenue: 680000, expenses: 490000 },
    { month: "Jul", revenue: 720000, expenses: 510000 },
    { month: "Aug", revenue: 760000, expenses: 530000 },
    { month: "Sep", revenue: 810000, expenses: 550000 },
    { month: "Oct", revenue: 860000, expenses: 580000 },
    { month: "Nov", revenue: 934000, expenses: 610000 },
  ];

  const attendanceBreakdown = data?.attendanceBreakdown || [
    { name: "Present", value: 18, color: "#16A34A" },
    { name: "Late", value: 3, color: "#F59E0B" },
    { name: "On Leave", value: 2, color: "#2563EB" },
    { name: "Absent", value: 1, color: "#DC2626" },
  ];

  const siteGuardDistribution = data?.siteGuardDistribution || [
    { name: "GPHouse HQ", required: 8, deployed: 8 },
    { name: "GP Data Centre", required: 4, deployed: 4 },
    { name: "Walton Plant", required: 12, deployed: 10 },
    { name: "Square Pharma", required: 6, deployed: 6 },
    { name: "Apex Warehouse", required: 8, deployed: 7 },
  ];

  return (
    <AppLayout onRefresh={fetchDashboardData}>
      <div className="space-y-6 pb-12">
        {/* Top Operational Header */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Security Operations Center (SOC)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              GuardPro Central Command & Operations
            </h1>
            <p className="text-sm text-slate-500">
              Live corporate oversight, guard deployments, payroll, and billing across Bangladesh.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/roster"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Duty Roster</span>
            </Link>
            <Link
              href="/attendance"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow-sm"
            >
              <Clock className="w-4 h-4" />
              <span>Attendance</span>
            </Link>
            <Link
              href="/invoices"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition shadow-sm"
            >
              <Receipt className="w-4 h-4 text-slate-500" />
              <span>Billing</span>
            </Link>
          </div>
        </div>

        {/* 10 Enterprise KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Total Employees */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Employees</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalEmployees}</p>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Staff & Field Officers</span>
            </div>
          </div>

          {/* Active Security Guards */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Guards</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.activeGuards}</p>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
              <span>Police Verified & Trained</span>
            </div>
          </div>

          {/* Guards Currently On Duty */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Guards On Duty</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-indigo-600 mt-2">{stats.guardsOnDuty}</p>
            <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              <span>Active on client posts</span>
            </div>
          </div>

          {/* Guards Absent Today */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Absent Today</span>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
                <UserX className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.guardsAbsent}</p>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Post Coverage</span>
            </div>
          </div>

          {/* Corporate Clients */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Corporate Clients</span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalClients}</p>
            <div className="flex items-center gap-1 text-xs text-purple-600 font-medium mt-1">
              <span>Premier Enterprises</span>
            </div>
          </div>

          {/* Active Security Sites */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Sites</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.activeSites}</p>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
              <span>Dhaka & Gazipur Plants</span>
            </div>
          </div>

          {/* Monthly Payroll */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Monthly Payroll</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <Banknote className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-2">
              {formatCurrency(stats.monthlyPayroll)}
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
              <span>Disbursed via BEFTN</span>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Monthly Revenue</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-emerald-600 mt-2">
              {formatCurrency(stats.monthlyRevenue)}
            </p>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Realized Collections</span>
            </div>
          </div>

          {/* Outstanding Client Dues */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Outstanding Dues</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-amber-600 mt-2">
              {formatCurrency(stats.outstandingClientPayments)}
            </p>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-medium mt-1">
              <span>Receivables (Net 30)</span>
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Monthly Expenses</span>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-2">
              {formatCurrency(stats.monthlyExpenses)}
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
              <span>Operations & Logistics</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue vs Expenses Chart (2 cols) */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Financial Growth & Cash Flow</h3>
                <p className="text-xs text-slate-500">
                  Monthly client billing revenue vs operational expenses (in BDT ৳)
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-200">
                FY 2026 (H2)
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), ""]}
                    contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="revenue" name="Client Invoiced Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Operational Expenses & Payroll" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Attendance Breakdown (1 col) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900">Attendance Today</h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  92% Present
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Roll-call summary across all shifts</p>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {attendanceBreakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`${val} Guards`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              {attendanceBreakdown.map((item: any) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600">{item.name}:</span>
                  <span className="font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Split: Live Duty Roster & Security Incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Duty Roster (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Today&apos;s Active Duty Assignments</h3>
                <p className="text-xs text-slate-500">Live deployment log for key client security posts</p>
              </div>
              <Link
                href="/roster"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View Full Roster</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Guard Details</th>
                    <th className="py-3 px-4">Client & Site</th>
                    <th className="py-3 px-4">Shift Schedule</th>
                    <th className="py-3 px-4">Supervisor</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {data?.recentDutyRosters?.length ? (
                    data.recentDutyRosters.map((roster: any) => (
                      <tr key={roster._id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{roster.guardName}</p>
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {roster.guardBadge}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800">{roster.clientName}</p>
                          <p className="text-slate-500">{roster.siteName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-blue-600">{roster.shift}</p>
                          <p className="text-slate-400">
                            {roster.startTime} - {roster.endTime}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{roster.supervisorName}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {roster.assignmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        Loading live roster...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Security Incidents & Alerts (1 col) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Incident & Safety Log</h3>
                <p className="text-xs text-slate-500">Live operational alerts</p>
              </div>
              <Link
                href="/incidents"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-96">
              {data?.recentIncidents?.length ? (
                data.recentIncidents.map((inc: any) => (
                  <div
                    key={inc._id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] font-bold text-blue-700">
                        {inc.incidentNo}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          inc.severity === "Critical"
                            ? "bg-rose-100 text-rose-700"
                            : inc.severity === "High"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{inc.siteName}</p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{inc.description}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                      <span>Status: <strong className="text-emerald-600">{inc.status}</strong></span>
                      <span>{inc.reportedDate}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">No active incidents</div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <Link
                href="/incidents"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Log New Incident Report</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Site Deployment Guard Allocation Overview */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Site-wise Guard Deployment</h3>
              <p className="text-xs text-slate-500">
                Guard requirements vs actual deployed personnel across major installations
              </p>
            </div>
            <Link
              href="/clients"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Manage Client Sites</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={siteGuardDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="required" name="Required Guards" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deployed" name="Deployed On Post" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

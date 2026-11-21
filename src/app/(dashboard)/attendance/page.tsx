"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatDate } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Plus,
  Search,
  Filter,
  Printer,
  X,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [guards, setGuards] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");

  // Check In Modal
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [form, setForm] = useState({
    guardId: "",
    siteId: "",
    date: "",
    checkInTime: "05:55",
    checkOutTime: "14:05",
    status: "Present",
    overtimeHours: 0,
    checkInMethod: "Supervisor Entry",
    remarks: "On post punctually",
  });

  const fetchAttendance = async (currentDate?: string) => {
    try {
      setLoading(true);
      const queryDate = currentDate || date || "2026-11-21";
      const res = await fetch(`/api/attendance?date=${queryDate}&status=${status}`);
      const json = await res.json();
      if (json.success) setAttendance(json.data);
    } catch {
      toast.error("Error loading attendance");
    } finally {
      setLoading(false);
    }
  };

  const fetchGuardsAndSites = async () => {
    try {
      const [resG, resS] = await Promise.all([fetch("/api/guards"), fetch("/api/sites")]);
      const jsonG = await resG.json();
      const jsonS = await resS.json();
      if (jsonG.success) {
        setGuards(jsonG.data);
        if (jsonG.data.length > 0) setForm((prev) => ({ ...prev, guardId: jsonG.data[0]._id }));
      }
      if (jsonS.success) {
        setSites(jsonS.data);
        if (jsonS.data.length > 0) setForm((prev) => ({ ...prev, siteId: jsonS.data[0]._id }));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (!date) {
      setDate(today);
      setForm((prev) => ({ ...prev, date: today }));
    }
    fetchAttendance(date || today);
    fetchGuardsAndSites();
  }, [date, status]);

  const handleRecordAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Attendance entry logged!");
        setShowCheckInModal(false);
        fetchAttendance();
      } else {
        toast.error(json.error || "Failed to log attendance");
      }
    } catch {
      toast.error("Error logging attendance");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: true, approvedBy: "Supervisor Kabir Hossain" }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Attendance verified and approved");
        fetchAttendance();
      }
    } catch {
      toast.error("Failed to approve");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Daily Operations
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Attendance Management</h1>
            <p className="text-sm text-slate-500">
              Biometric, QR, and supervisor-verified check-in logs with automated overtime calculation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>
            <button
              onClick={() => setShowCheckInModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Log Manual Attendance</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">Select Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Status Filter:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden printable-area">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Guard Personnel</th>
                  <th className="py-3 px-4">Site Location</th>
                  <th className="py-3 px-4">Check-In</th>
                  <th className="py-3 px-4">Check-Out</th>
                  <th className="py-3 px-4">Status & Late (min)</th>
                  <th className="py-3 px-4">Overtime</th>
                  <th className="py-3 px-4">Method & Verification</th>
                  <th className="py-3 px-4 text-right no-print">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Loading attendance records...
                    </td>
                  </tr>
                ) : attendance.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No attendance logged for {formatDate(date)}.
                    </td>
                  </tr>
                ) : (
                  attendance.map((att) => (
                    <tr key={att._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{att.guardName}</p>
                        <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {att.badgeNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{att.siteName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {att.checkInTime || "-"}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {att.checkOutTime || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            att.status === "Present"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : att.status === "Late"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {att.status} {att.lateMinutes > 0 ? `(${att.lateMinutes}m)` : ""}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-600">
                        {att.overtimeHours ? `${att.overtimeHours} hrs` : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-700">{att.checkInMethod}</p>
                        <p className="text-[10px] text-slate-400">{att.remarks || "No remarks"}</p>
                      </td>
                      <td className="py-3 px-4 text-right no-print">
                        {att.isApproved ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approved
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApprove(att._id)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Log Manual Attendance */}
        {showCheckInModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Record Attendance Entry</h3>
                <button
                  onClick={() => setShowCheckInModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordAttendance} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Security Guard</label>
                  <select
                    value={form.guardId}
                    onChange={(e) => setForm({ ...form, guardId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {guards.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.fullName} ({g.badgeNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Site</label>
                  <select
                    value={form.siteId}
                    onChange={(e) => setForm({ ...form, siteId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {sites.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.siteName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Check-in Time (HH:mm)</label>
                    <input
                      type="text"
                      value={form.checkInTime}
                      onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
                      placeholder="06:00"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Check-out Time (HH:mm)</label>
                    <input
                      type="text"
                      value={form.checkOutTime}
                      onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
                      placeholder="14:00"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Attendance Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="Present">Present</option>
                      <option value="Late">Late</option>
                      <option value="Half Day">Half Day</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Overtime (Hours)</label>
                    <input
                      type="number"
                      value={form.overtimeHours}
                      onChange={(e) => setForm({ ...form, overtimeHours: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Verification Remarks</label>
                  <input
                    type="text"
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCheckInModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatDate } from "@/lib/utils";
import {
  CalendarDays,
  Plus,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function RosterPage() {
  const [rosters, setRosters] = useState<any[]>([]);
  const [guards, setGuards] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Add Duty Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    guardId: "",
    siteId: "",
    shift: "Morning (06:00 - 14:00)",
    dutyDate: "",
    startTime: "06:00",
    endTime: "14:00",
    supervisorName: "Supervisor Kabir Hossain",
    notes: "Main Gate Inspection",
  });

  const fetchRosters = async (currentDate?: string) => {
    try {
      setLoading(true);
      const queryDate = currentDate || date || "2026-11-21";
      const res = await fetch(`/api/roster?date=${queryDate}`);
      const json = await res.json();
      if (json.success) setRosters(json.data);
    } catch {
      toast.error("Error loading duty roster");
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
      setForm((prev) => ({ ...prev, dutyDate: today }));
    }
    fetchRosters(date || today);
    fetchGuardsAndSites();
  }, [date]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Duty assignment scheduled successfully!");
        setShowAddModal(false);
        fetchRosters();
      } else {
        toast.error(json.error || "Failed to schedule duty");
      }
    } catch {
      toast.error("Error creating assignment");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/roster", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, assignmentStatus: status }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Duty status updated to ${status}`);
        fetchRosters();
      }
    } catch {
      toast.error("Failed to update status");
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
                Shift Operations
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Duty Roster & Scheduling</h1>
            <p className="text-sm text-slate-500">
              Daily and monthly guard deployment schedules with automatic conflict prevention.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Roster</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Duty Shift</span>
            </button>
          </div>
        </div>

        {/* Date Selector & Shift Overview Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">Select Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Shift Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
              Morning (06:00 - 14:00)
            </span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Evening (14:00 - 22:00)
            </span>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              Night (22:00 - 06:00)
            </span>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
              12H Tactical Shifts
            </span>
          </div>
        </div>

        {/* Roster Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden printable-area">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              Deployment Schedule for {formatDate(date)}
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Total Assigned: {rosters.length} Guards
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Guard Personnel</th>
                  <th className="py-3 px-4">Client & Site</th>
                  <th className="py-3 px-4">Shift & Timings</th>
                  <th className="py-3 px-4">Duty Supervisor</th>
                  <th className="py-3 px-4">Post Instructions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right no-print">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Loading scheduled duty roster...
                    </td>
                  </tr>
                ) : rosters.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No duty roster assigned for this date yet.
                    </td>
                  </tr>
                ) : (
                  rosters.map((roster) => (
                    <tr key={roster._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{roster.guardName}</p>
                        <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {roster.guardBadge}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{roster.clientName}</p>
                        <p className="text-slate-500">{roster.siteName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-blue-600 block">{roster.shift}</span>
                        <span className="text-slate-400 text-[11px]">
                          {roster.startTime} - {roster.endTime}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{roster.supervisorName}</td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {roster.notes || "Standard security patrol"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            roster.assignmentStatus === "On Duty"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : roster.assignmentStatus === "Scheduled"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : roster.assignmentStatus === "Absent"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {roster.assignmentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right no-print">
                        <select
                          value={roster.assignmentStatus}
                          onChange={(e) => handleUpdateStatus(roster._id, e.target.value)}
                          className="text-[11px] font-semibold bg-slate-50 border border-slate-200 py-1 px-2 rounded-lg"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="On Duty">On Duty</option>
                          <option value="Completed">Completed</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Assign Duty Shift */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Assign Security Duty Shift</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Security Guard</label>
                  <select
                    value={form.guardId}
                    onChange={(e) => setForm({ ...form, guardId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {guards.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.fullName} ({g.badgeNumber}) - {g.rank}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Client Site</label>
                  <select
                    value={form.siteId}
                    onChange={(e) => setForm({ ...form, siteId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {sites.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.siteName} ({s.clientName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duty Date</label>
                    <input
                      type="date"
                      value={form.dutyDate}
                      onChange={(e) => setForm({ ...form, dutyDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Shift</label>
                    <select
                      value={form.shift}
                      onChange={(e) => {
                        const shiftVal = e.target.value;
                        let st = "06:00",
                          et = "14:00";
                        if (shiftVal.includes("Evening")) {
                          st = "14:00";
                          et = "22:00";
                        } else if (shiftVal.includes("Night")) {
                          st = "22:00";
                          et = "06:00";
                        } else if (shiftVal.includes("12H Day")) {
                          st = "08:00";
                          et = "20:00";
                        }
                        setForm({ ...form, shift: shiftVal, startTime: st, endTime: et });
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                      <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                      <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                      <option value="12H Day (08:00 - 20:00)">12H Day (08:00 - 20:00)</option>
                      <option value="12H Night (20:00 - 08:00)">12H Night (20:00 - 08:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Supervisor</label>
                  <input
                    type="text"
                    value={form.supervisorName}
                    onChange={(e) => setForm({ ...form, supervisorName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specific Duty Post / Notes</label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="e.g. Gate 1 Main Entry VIP Escort"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Confirm Shift
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

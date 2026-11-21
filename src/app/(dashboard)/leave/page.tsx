"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatDate } from "@/lib/utils";
import {
  CalendarOff,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function LeavePage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    leaveType: "Casual Leave",
    fromDate: "2026-11-20",
    toDate: "2026-11-22",
    totalDays: 2,
    reason: "",
  });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const [resL, resE] = await Promise.all([fetch("/api/leave"), fetch("/api/employees")]);
      const jsonL = await resL.json();
      const jsonE = await resE.json();
      if (jsonL.success) setLeaves(jsonL.data);
      if (jsonE.success) {
        setEmployees(jsonE.data);
        if (jsonE.data.length > 0) {
          setForm((prev) => ({
            ...prev,
            employeeId: jsonE.data[0].employeeId,
            employeeName: jsonE.data[0].fullName,
          }));
        }
      }
    } catch {
      toast.error("Error loading leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Leave request submitted for approval");
        setShowApplyModal(false);
        fetchLeaves();
      }
    } catch {
      toast.error("Failed to submit leave request");
    }
  };

  const handleReview = async (id: string, status: "Approved" | "Rejected") => {
    try {
      const res = await fetch("/api/leave", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          approvedBy: "Sharmin Sultana (HR Manager)",
          approvalRemarks: status === "Approved" ? "Authorized with full allowance." : "Staffing constraints.",
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Leave request ${status.toLowerCase()}`);
        fetchLeaves();
      }
    } catch {
      toast.error("Error processing leave");
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
                Human Resources
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Leave Management</h1>
            <p className="text-sm text-slate-500">
              Submit, review, and approve guard & staff leave applications with quota tracking.
            </p>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Loading leave applications...
                    </td>
                  </tr>
                ) : leaves.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No leave requests on record.
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{leave.employeeName}</p>
                        <span className="font-mono text-[10px] text-slate-500">{leave.employeeId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {formatDate(leave.fromDate)} to {formatDate(leave.toDate)}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{leave.totalDays} Days</td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">{leave.reason}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            leave.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : leave.status === "Rejected"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {leave.status === "Pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReview(leave._id, "Approved")}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReview(leave._id, "Rejected")}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">{leave.approvedBy || "Reviewed"}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Apply */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Submit Leave Application</h3>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee</label>
                  <select
                    value={form.employeeId}
                    onChange={(e) => {
                      const emp = employees.find((x) => x.employeeId === e.target.value);
                      setForm({
                        ...form,
                        employeeId: e.target.value,
                        employeeName: emp?.fullName || "",
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp.employeeId}>
                        {emp.fullName} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                  <select
                    value={form.leaveType}
                    onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={form.fromDate}
                      onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={form.toDate}
                      onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Days</label>
                  <input
                    type="number"
                    min="1"
                    value={form.totalDays}
                    onChange={(e) => setForm({ ...form, totalDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason for Leave</label>
                  <textarea
                    rows={2}
                    required
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Provide specific reason..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Submit Request
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

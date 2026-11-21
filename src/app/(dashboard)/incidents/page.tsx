"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatDate } from "@/lib/utils";
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  X,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  const [form, setForm] = useState({
    siteName: "",
    clientName: "Grameenphone Ltd.",
    reportedBy: "Senior Guard Md. Rafiqul Islam",
    category: "Client Complaint",
    severity: "Medium",
    description: "",
    actionTaken: "",
    assignedInvestigator: "Kamrul Ahsan (Ops Manager)",
  });

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const [resI, resS] = await Promise.all([fetch("/api/incidents"), fetch("/api/sites")]);
      const jsonI = await resI.json();
      const jsonS = await resS.json();
      if (jsonI.success) setIncidents(jsonI.data);
      if (jsonS.success) {
        setSites(jsonS.data);
        if (jsonS.data.length > 0) {
          setForm((prev) => ({
            ...prev,
            siteName: jsonS.data[0].siteName,
            clientName: jsonS.data[0].clientName,
          }));
        }
      }
    } catch {
      toast.error("Error loading incidents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Incident report ${json.data.incidentNo} logged!`);
        setShowAddModal(false);
        fetchIncidents();
      }
    } catch {
      toast.error("Failed to log incident");
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch("/api/incidents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: "Resolved",
          resolutionSummary: "Investigation completed. Corrective action taken and reported to client.",
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Incident marked as resolved");
        fetchIncidents();
      }
    } catch {
      toast.error("Error resolving incident");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Security & Risk Response
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Incident & Complaint Management</h1>
            <p className="text-sm text-slate-500">
              Log security breaches, trespassing alerts, guard misconduct, and client complaints with audit trails.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log Incident Report</span>
          </button>
        </div>

        {/* Incident List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              Loading incident logs...
            </div>
          ) : incidents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              No security incidents logged. All sites clear.
            </div>
          ) : (
            incidents.map((inc) => (
              <div
                key={inc._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {inc.incidentNo}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        inc.severity === "Critical"
                          ? "bg-rose-100 text-rose-700"
                          : inc.severity === "High"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {inc.severity} Severity
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        inc.status === "Resolved" || inc.status === "Closed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{inc.siteName}</h3>
                  <p className="text-xs text-slate-500">{inc.clientName} • Category: {inc.category}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                  <p className="text-slate-700 font-medium">{inc.description}</p>
                  <p className="text-slate-500 pt-1 border-t border-slate-200">
                    <strong>Action Taken:</strong> {inc.actionTaken}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                  <span>Reported: {inc.reportedDate}</span>
                  {inc.status !== "Resolved" && inc.status !== "Closed" ? (
                    <button
                      onClick={() => handleResolve(inc._id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-semibold">Resolution Documented</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Log Incident */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-base">File Security Incident Report</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateIncident} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Site Location</label>
                  <select
                    value={form.siteName}
                    onChange={(e) => {
                      const siteObj = sites.find((s) => s.siteName === e.target.value);
                      setForm({
                        ...form,
                        siteName: e.target.value,
                        clientName: siteObj?.clientName || form.clientName,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {sites.map((s) => (
                      <option key={s._id} value={s.siteName}>
                        {s.siteName} ({s.clientName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Incident Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="Client Complaint">Client Complaint</option>
                      <option value="Trespassing">Trespassing</option>
                      <option value="Theft / Loss">Theft / Loss</option>
                      <option value="Guard Misconduct">Guard Misconduct</option>
                      <option value="Fire / Safety Hazard">Fire / Safety Hazard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Severity Level</label>
                    <select
                      value={form.severity}
                      onChange={(e) => setForm({ ...form, severity: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Incident Description</label>
                  <textarea
                    rows={2}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Specific facts, time, gate number, people involved..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Immediate Action Taken</label>
                  <textarea
                    rows={2}
                    required
                    value={form.actionTaken}
                    onChange={(e) => setForm({ ...form, actionTaken: e.target.value })}
                    placeholder="How was the situation intercepted and handled?"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
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
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    File Incident
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

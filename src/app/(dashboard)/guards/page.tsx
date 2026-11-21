"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  UserCheck,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  X,
  FileCheck,
  Award,
  ArrowRightLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function GuardsPage() {
  const [guards, setGuards] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [rank, setRank] = useState("All");
  const [search, setSearch] = useState("");

  // Transfer / Deploy Modal
  const [selectedGuard, setSelectedGuard] = useState<any>(null);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedShift, setSelectedShift] = useState("Morning (06:00 - 14:00)");

  const fetchGuards = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== "All") params.append("status", status);
      if (rank !== "All") params.append("rank", rank);
      if (search) params.append("search", search);

      const [resGuards, resSites] = await Promise.all([
        fetch(`/api/guards?${params.toString()}`),
        fetch("/api/sites"),
      ]);

      const jsonGuards = await resGuards.json();
      const jsonSites = await resSites.json();

      if (jsonGuards.success) setGuards(jsonGuards.data);
      if (jsonSites.success) {
        setSites(jsonSites.data);
        if (jsonSites.data.length > 0) setSelectedSiteId(jsonSites.data[0]._id);
      }
    } catch {
      toast.error("Error loading guard registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuards();
  }, [status, rank]);

  const handleDeployOrTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuard || !selectedSiteId) return;

    try {
      const res = await fetch("/api/guards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guardId: selectedGuard._id,
          action: "deploy",
          siteId: selectedSiteId,
          shift: selectedShift,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Guard ${selectedGuard.fullName} deployed to site!`);
        setSelectedGuard(null);
        fetchGuards();
      } else {
        toast.error(json.error || "Failed to deploy guard");
      }
    } catch {
      toast.error("Error during deployment");
    }
  };

  const handleStatusChange = async (guardId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/guards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guardId,
          action: "status_change",
          status: newStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchGuards();
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
                Security Personnel Registry
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Security Guard Management</h1>
            <p className="text-sm text-slate-500">
              Manage training certificates, police verifications, weapons licenses, and post deployments.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchGuards()}
              placeholder="Search by guard name, badge number, or site..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="On Duty">On Duty</option>
              <option value="Available">Available</option>
              <option value="On Leave">On Leave</option>
              <option value="Absent">Absent</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All">All Ranks</option>
              <option value="Junior Guard">Junior Guard</option>
              <option value="Senior Guard">Senior Guard</option>
              <option value="Gunman">Armed Gunman</option>
              <option value="Supervisor">Supervisor</option>
            </select>
          </div>
        </div>

        {/* Guard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              Loading security personnel database...
            </div>
          ) : guards.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              No security guards found.
            </div>
          ) : (
            guards.map((guard) => (
              <div
                key={guard._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {guard.badgeNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        guard.deploymentStatus === "On Duty"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : guard.deploymentStatus === "Available"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {guard.deploymentStatus}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-bold text-slate-900 text-base">{guard.fullName}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{guard.rank}</p>
                  </div>

                  {/* Badges / Verifications */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" />
                      Police: {guard.policeVerificationStatus}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      Medical: {guard.medicalFitnessStatus}
                    </span>
                    {guard.weaponsLicense && (
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold border border-amber-200">
                        Armed License Verified
                      </span>
                    )}
                  </div>

                  {/* Deployment Site details */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{guard.currentSiteName || "Not Deployed (In Reserve Pool)"}</span>
                    </div>
                    {guard.currentShift && (
                      <div className="text-[11px] text-blue-600 font-medium pl-5">
                        Shift: {guard.currentShift}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedGuard(guard)}
                    className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Deploy / Transfer</span>
                  </button>

                  <select
                    value={guard.deploymentStatus}
                    onChange={(e) => handleStatusChange(guard._id, e.target.value)}
                    className="text-[11px] font-semibold bg-slate-100 border border-slate-200 text-slate-700 py-1.5 px-2 rounded-lg"
                  >
                    <option value="On Duty">On Duty</option>
                    <option value="Available">Available</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Deploy / Transfer Modal */}
        {selectedGuard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Deploy / Transfer Guard</h3>
                  <p className="text-xs text-slate-500">
                    {selectedGuard.fullName} ({selectedGuard.badgeNumber})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGuard(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDeployOrTransfer} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Client Site</label>
                  <select
                    value={selectedSiteId}
                    onChange={(e) => setSelectedSiteId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {sites.map((site) => (
                      <option key={site._id} value={site._id}>
                        {site.siteName} ({site.clientName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duty Shift</label>
                  <select
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                    <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                    <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                    <option value="12H Day (08:00 - 20:00)">12H Day (08:00 - 20:00)</option>
                    <option value="12H Night (20:00 - 08:00)">12H Night (20:00 - 08:00)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedGuard(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Confirm Deployment
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

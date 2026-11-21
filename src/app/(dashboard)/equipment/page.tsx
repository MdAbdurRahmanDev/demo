"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  Plus,
  ArrowRightLeft,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Shield,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function EquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [guards, setGuards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedEq, setSelectedEq] = useState<any>(null);

  const [form, setForm] = useState({
    guardBadge: "",
    guardName: "",
    action: "issue",
    condition: "Good",
    notes: "Issued for field security operations",
  });

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const [resE, resG] = await Promise.all([fetch("/api/equipment"), fetch("/api/guards")]);
      const jsonE = await resE.json();
      const jsonG = await resG.json();
      if (jsonE.success) setEquipmentList(jsonE.data);
      if (jsonG.success) {
        setGuards(jsonG.data);
        if (jsonG.data.length > 0) {
          setForm((prev) => ({
            ...prev,
            guardBadge: jsonG.data[0].badgeNumber,
            guardName: jsonG.data[0].fullName,
          }));
        }
      }
    } catch {
      toast.error("Error loading equipment inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleIssueOrReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEq) return;

    try {
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: selectedEq._id,
          ...form,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Equipment successfully ${form.action}d!`);
        setShowIssueModal(false);
        fetchEquipment();
      } else {
        toast.error(json.error || "Action failed");
      }
    } catch {
      toast.error("Error updating inventory");
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
                Logistics & Armory
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Equipment & Inventory Management</h1>
            <p className="text-sm text-slate-500">
              Manage uniforms, radios, walkie-talkies, handheld metal detectors, batons, and guard issue logs.
            </p>
          </div>
        </div>

        {/* Equipment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              Loading inventory stock...
            </div>
          ) : (
            equipmentList.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-blue-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.itemCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === "In Stock"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-2">{item.itemName}</h3>
                  <p className="text-xs text-slate-500">{item.category}</p>

                  <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-center text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total</span>
                      <strong className="text-slate-800">{item.totalStock}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Assigned</span>
                      <strong className="text-blue-600">{item.assignedCount}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Available</span>
                      <strong className="text-emerald-600">{item.availableCount}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedEq(item);
                      setForm((prev) => ({ ...prev, action: "issue" }));
                      setShowIssueModal(true);
                    }}
                    className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition text-center"
                  >
                    Issue to Guard
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEq(item);
                      setForm((prev) => ({ ...prev, action: "return" }));
                      setShowIssueModal(true);
                    }}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    Return
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Issue / Return Equipment */}
        {showIssueModal && selectedEq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {form.action === "issue" ? "Issue Equipment to Guard" : "Return Equipment from Guard"}
                  </h3>
                  <p className="text-slate-500 font-semibold">{selectedEq.itemName}</p>
                </div>
                <button
                  onClick={() => setShowIssueModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleIssueOrReturn} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Guard</label>
                  <select
                    value={form.guardBadge}
                    onChange={(e) => {
                      const g = guards.find((x) => x.badgeNumber === e.target.value);
                      setForm({
                        ...form,
                        guardBadge: e.target.value,
                        guardName: g?.fullName || "",
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {guards.map((g) => (
                      <option key={g._id} value={g.badgeNumber}>
                        {g.fullName} ({g.badgeNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Physical Condition</label>
                  <select
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="New">Brand New</option>
                    <option value="Good">Good Working Condition</option>
                    <option value="Fair">Fair / Normal Wear</option>
                    <option value="Damaged">Damaged / Requires Repair</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue/Return Notes</label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Confirm {form.action === "issue" ? "Issue" : "Return"}
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

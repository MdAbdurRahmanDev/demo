"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  Plus,
  MapPin,
  Users,
  Shield,
  Phone,
  Mail,
  Receipt,
  CheckCircle2,
  ExternalLink,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [activeClientForSite, setActiveClientForSite] = useState<any>(null);

  // New Client Form
  const [clientForm, setClientForm] = useState({
    companyName: "",
    contactPerson: "",
    designation: "Security & Facility Manager",
    phone: "",
    email: "",
    address: "",
    billingAddress: "",
    tradeLicenseNumber: "",
    binVatNumber: "",
    paymentTerms: "Net 30",
  });

  // New Site Form
  const [siteForm, setSiteForm] = useState({
    siteName: "",
    address: "",
    city: "Dhaka",
    siteManagerName: "",
    siteManagerPhone: "",
    requiredGuards: 4,
    requiredSupervisors: 1,
    billingRatePerGuard: 22000,
    specialInstructions: "",
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/clients");
      const json = await res.json();
      if (json.success) setClients(json.data);
    } catch {
      toast.error("Error loading clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.companyName || !clientForm.phone || !clientForm.email) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Client ${json.data.companyName} registered!`);
        setShowAddClientModal(false);
        fetchClients();
      }
    } catch {
      toast.error("Failed to register client");
    }
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClientForSite || !siteForm.siteName) return;

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...siteForm,
          clientId: activeClientForSite._id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Site ${json.data.siteName} added to client!`);
        setShowAddSiteModal(false);
        fetchClients();
      }
    } catch {
      toast.error("Failed to add site");
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
                Corporate Portfolios
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Client & Site Management</h1>
            <p className="text-sm text-slate-500">
              Manage client contracts, commercial rates, post requirements, and multi-location security sites.
            </p>
          </div>

          <button
            onClick={() => setShowAddClientModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Company</span>
          </button>
        </div>

        {/* Clients List */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
              Loading client accounts...
            </div>
          ) : (
            clients.map((client) => (
              <div
                key={client._id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4"
              >
                {/* Client Main Summary */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center border border-purple-200 text-base">
                      {client.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{client.companyName}</h3>
                        <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {client.clientCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Contact: <strong className="text-slate-700">{client.contactPerson}</strong> (
                        {client.designation}) • {client.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveClientForSite(client);
                        setShowAddSiteModal(true);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Site</span>
                    </button>
                  </div>
                </div>

                {/* Client Security Sites Cards */}
                <div>
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                    Active Security Sites ({client.sites?.length || 0})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {client.sites?.map((site: any) => (
                      <div
                        key={site._id}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-sm">{site.siteName}</span>
                          <span className="font-mono text-[10px] font-bold text-blue-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {site.siteCode}
                          </span>
                        </div>
                        <p className="text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{site.address}</span>
                        </p>
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-600">
                          <span>
                            Required: <strong className="text-slate-900">{site.requiredGuards} Guards</strong>
                          </span>
                          <span className="font-bold text-emerald-700">
                            {formatCurrency(site.billingRatePerGuard)}/guard
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Add Client */}
        {showAddClientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Register New Client Company</h3>
                <button
                  onClick={() => setShowAddClientModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={clientForm.companyName}
                    onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
                    placeholder="e.g. Beximco Group Ltd."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Person *</label>
                    <input
                      type="text"
                      required
                      value={clientForm.contactPerson}
                      onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })}
                      placeholder="Name of Admin / Security Head"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                      placeholder="+880 17XXXXXXXX"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    placeholder="security@company.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Head Office Address</label>
                  <input
                    type="text"
                    value={clientForm.address}
                    onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                    placeholder="Gulshan, Dhaka"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddClientModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Save Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Site to Client */}
        {showAddSiteModal && activeClientForSite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add Security Site</h3>
                  <p className="text-slate-500">For {activeClientForSite.companyName}</p>
                </div>
                <button
                  onClick={() => setShowAddSiteModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSite} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Site / Facility Name *</label>
                  <input
                    type="text"
                    required
                    value={siteForm.siteName}
                    onChange={(e) => setSiteForm({ ...siteForm, siteName: e.target.value })}
                    placeholder="e.g. Central Warehouse Gazipur"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Site Address *</label>
                  <input
                    type="text"
                    required
                    value={siteForm.address}
                    onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
                    placeholder="Plot 10, Kaliakair, Gazipur"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Site Manager Name</label>
                    <input
                      type="text"
                      value={siteForm.siteManagerName}
                      onChange={(e) => setSiteForm({ ...siteForm, siteManagerName: e.target.value })}
                      placeholder="Manager name"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Manager Phone</label>
                    <input
                      type="text"
                      value={siteForm.siteManagerPhone}
                      onChange={(e) => setSiteForm({ ...siteForm, siteManagerPhone: e.target.value })}
                      placeholder="+880 17XXXXXXXX"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Required Guards</label>
                    <input
                      type="number"
                      value={siteForm.requiredGuards}
                      onChange={(e) => setSiteForm({ ...siteForm, requiredGuards: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Billing Rate / Guard (৳)</label>
                    <input
                      type="number"
                      value={siteForm.billingRatePerGuard}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, billingRatePerGuard: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddSiteModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Save Site
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

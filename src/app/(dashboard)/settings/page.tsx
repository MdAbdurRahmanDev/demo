"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Settings,
  Building,
  Clock,
  Shield,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    companyName: "GuardPro Security Services Bangladesh Ltd.",
    tagline: "Premier Corporate, Industrial & Banking Security Solutions",
    registrationNumber: "C-184920/2022",
    tradeLicenseNumber: "TRAD/DNCC/049281/2021",
    tinBinNumber: "BIN: 004928192-0101",
    phone: "+880 2 9887766, +880 1711-234567",
    email: "contact@guardpro.com.bd",
    headOfficeAddress: "Level 7, GuardPro Tower, Plot 14, Road 11, Gulshan-2, Dhaka-1212",
    vatRatePercentage: 5,
    overtimeHourlyRateMultiplier: 1.5,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data) setSettings(j.data);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Company settings and shift parameters updated!");
      }
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              System Configuration
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Company Profile & System Settings</h1>
          <p className="text-sm text-slate-500">
            Configure headquarters profile, corporate BIN/TIN registrations, shifts, and VAT policies.
          </p>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 border-b border-slate-100 pb-2">
              Corporate Headquarters Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">RJSC Registration No</label>
                <input
                  type="text"
                  value={settings.registrationNumber}
                  onChange={(e) => setSettings({ ...settings, registrationNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trade License No</label>
                <input
                  type="text"
                  value={settings.tradeLicenseNumber}
                  onChange={(e) => setSettings({ ...settings, tradeLicenseNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">BIN / VAT Registration</label>
                <input
                  type="text"
                  value={settings.tinBinNumber}
                  onChange={(e) => setSettings({ ...settings, tinBinNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Helpline Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Head Office Address</label>
                <input
                  type="text"
                  value={settings.headOfficeAddress}
                  onChange={(e) => setSettings({ ...settings, headOfficeAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 border-b border-slate-100 pb-2">
              Statutory & Overtime Policies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NBR Security VAT Rate (%)</label>
                <input
                  type="number"
                  value={settings.vatRatePercentage}
                  onChange={(e) => setSettings({ ...settings, vatRatePercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Overtime Multiplier Rate</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.overtimeHourlyRateMultiplier}
                  onChange={(e) =>
                    setSettings({ ...settings, overtimeHourlyRateMultiplier: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Configuration"}</span>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

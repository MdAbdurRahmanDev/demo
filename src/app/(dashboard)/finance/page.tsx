"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  CreditCard,
  Printer,
  X,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function FinancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const [form, setForm] = useState({
    type: "Expense",
    category: "Office Rent & Utilities",
    accountName: "BRAC Bank Ltd. - Corporate Account",
    amount: 15000,
    reference: "Voucher Reference",
    description: "Office utility and stationery expenses",
  });

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/finance");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      toast.error("Error loading finance ledgers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Voucher ${json.data.voucherNo} posted!`);
        setShowVoucherModal(false);
        fetchFinanceData();
      }
    } catch {
      toast.error("Failed to post transaction");
    }
  };

  const accounts = data?.accounts || [];
  const transactions = data?.transactions || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                General Ledger & Treasury
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Accounts & Finance</h1>
            <p className="text-sm text-slate-500">
              Corporate bank balances, payment vouchers (PV), receipt vouchers (RV), and cash flow ledgers.
            </p>
          </div>

          <button
            onClick={() => setShowVoucherModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Voucher</span>
          </button>
        </div>

        {/* Bank & Cash Balances Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {accounts.map((acc: any) => (
            <div key={acc._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{acc.accountType}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="font-bold text-slate-900 text-sm mt-1 truncate">{acc.accountName}</p>
              <p className="text-xl font-bold text-blue-700 mt-2 font-mono">
                {formatCurrency(acc.balance)}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">{acc.accountNumber || "Cash on hand"}</p>
            </div>
          ))}
        </div>

        {/* Financial Transactions Register */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Audited Financial Journal & Vouchers</h3>
            <span className="text-xs font-semibold text-slate-500">
              Net Balance: {formatCurrency(data?.netCashFlow || 0)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Voucher No</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Account</th>
                  <th className="py-3 px-4">Category & Details</th>
                  <th className="py-3 px-4">Amount (BDT ৳)</th>
                  <th className="py-3 px-4">Authorized By</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Loading financial ledger...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No transactions recorded.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx: any) => (
                    <tr key={tx._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{tx.voucherNo}</td>
                      <td className="py-3 px-4 text-slate-600">{formatDate(tx.date)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === "Income"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{tx.accountName}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{tx.category}</p>
                        <p className="text-[11px] text-slate-400">{tx.description}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {tx.type === "Income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{tx.performedBy}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create Voucher */}
        {showVoucherModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Issue Financial Voucher</h3>
                <button
                  onClick={() => setShowVoucherModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateVoucher} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Voucher Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="Expense">Payment Voucher (PV)</option>
                      <option value="Income">Receipt Voucher (RV)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Account</label>
                    <select
                      value={form.accountName}
                      onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    >
                      {accounts.map((a: any) => (
                        <option key={a._id} value={a.accountName}>
                          {a.accountName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expense/Income Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Uniform & Equipment Purchase">Uniform & Equipment Purchase</option>
                    <option value="Office Rent & Utilities">Office Rent & Utilities</option>
                    <option value="Guard Fuel & Travel Allowance">Guard Fuel & Travel Allowance</option>
                    <option value="Client Billing Payment">Client Billing Payment</option>
                    <option value="Legal & Police Clearance Fees">Legal & Police Clearance Fees</option>
                    <option value="Stationery & Refreshments">Stationery & Refreshments</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (BDT ৳)</label>
                  <input
                    type="number"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Narration / Description</label>
                  <textarea
                    rows={2}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Details of expense or income..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowVoucherModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Post Voucher
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

"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Receipt,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  DollarSign,
  X,
  CreditCard,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<any>(null);

  const [form, setForm] = useState({
    clientId: "",
    siteName: "",
    guardQuantity: 10,
    ratePerGuard: 22000,
    additionalCharges: 0,
    additionalChargesDescription: "",
    vatRatePercentage: 5,
    discountAmount: 0,
    billingPeriod: "November 2026",
    dueDate: "2026-11-30",
    notes: "Payment due within Net 30 days via BEFTN/Cheque",
  });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const [resI, resC] = await Promise.all([fetch("/api/invoices"), fetch("/api/clients")]);
      const jsonI = await resI.json();
      const jsonC = await resC.json();
      if (jsonI.success) setInvoices(jsonI.data);
      if (jsonC.success) {
        setClients(jsonC.data);
        if (jsonC.data.length > 0) {
          setForm((prev) => ({
            ...prev,
            clientId: jsonC.data[0]._id,
            siteName: jsonC.data[0].sites?.[0]?.siteName || "Headquarters",
          }));
        }
      }
    } catch {
      toast.error("Error loading invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Invoice ${json.data.invoiceNumber} created!`);
        setShowAddModal(false);
        fetchInvoices();
      } else {
        toast.error(json.error || "Failed to create invoice");
      }
    } catch {
      toast.error("Error creating invoice");
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;
    try {
      const res = await fetch("/api/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoiceForPayment._id,
          paymentAmount,
          method: "Bank Transfer",
          referenceNumber: `EFT-CL-${Math.floor(100000 + Math.random() * 900000)}`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Payment recorded successfully!");
        setSelectedInvoiceForPayment(null);
        fetchInvoices();
      }
    } catch {
      toast.error("Error recording payment");
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
                Revenue & Receivables
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Client Billing & Invoices</h1>
            <p className="text-sm text-slate-500">
              Contract-based billing, VAT/Tax calculation, partial/full payment tracking in Bangladeshi Taka (৳).
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Client Invoice</span>
          </button>
        </div>

        {/* Invoice Register Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Client Company</th>
                  <th className="py-3 px-4">Billing Period</th>
                  <th className="py-3 px-4">Guards & Rate</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Paid Amount</th>
                  <th className="py-3 px-4">Due Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      Loading invoice records...
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      No invoices generated yet.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{inv.clientName}</p>
                        <p className="text-[11px] text-slate-400">{inv.siteName}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{inv.billingPeriod}</td>
                      <td className="py-3 px-4">
                        <span>
                          {inv.guardQuantity} Guards × {formatCurrency(inv.ratePerGuard)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {formatCurrency(inv.totalAmount)}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-600">
                        {formatCurrency(inv.paidAmount)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-600">
                        {formatCurrency(inv.dueAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            inv.status === "Paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : inv.status === "Partial"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoiceForPrint(inv)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                            title="Print / View Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {inv.dueAmount > 0 && (
                            <button
                              onClick={() => {
                                setSelectedInvoiceForPayment(inv);
                                setPaymentAmount(inv.dueAmount);
                              }}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-bold border border-emerald-200"
                            >
                              Collect Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Generate Invoice */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Generate Monthly Client Invoice</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Client Company</label>
                  <select
                    value={form.clientId}
                    onChange={(e) => {
                      const cl = clients.find((x) => x._id === e.target.value);
                      setForm({
                        ...form,
                        clientId: e.target.value,
                        siteName: cl?.sites?.[0]?.siteName || "Headquarters",
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Deployed Guard Count</label>
                    <input
                      type="number"
                      value={form.guardQuantity}
                      onChange={(e) => setForm({ ...form, guardQuantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Billing Rate / Guard (৳)</label>
                    <input
                      type="number"
                      value={form.ratePerGuard}
                      onChange={(e) => setForm({ ...form, ratePerGuard: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Billing Period</label>
                    <input
                      type="text"
                      value={form.billingPeriod}
                      onChange={(e) => setForm({ ...form, billingPeriod: e.target.value })}
                      placeholder="e.g. November 2026"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Due Date</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">VAT Rate (%)</label>
                    <input
                      type="number"
                      value={form.vatRatePercentage}
                      onChange={(e) => setForm({ ...form, vatRatePercentage: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Commercial Discount (৳)</label>
                    <input
                      type="number"
                      value={form.discountAmount}
                      onChange={(e) => setForm({ ...form, discountAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900 flex justify-between items-center font-bold">
                  <span>Estimated Total (Incl. VAT):</span>
                  <span className="text-sm font-mono">
                    {formatCurrency(
                      form.guardQuantity * form.ratePerGuard * (1 + form.vatRatePercentage / 100) -
                        form.discountAmount
                    )}
                  </span>
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
                    Issue Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Collect Payment */}
        {selectedInvoiceForPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Record Client Payment</h3>
                <button
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-3">
                <p className="text-slate-600">
                  Invoice: <strong>{selectedInvoiceForPayment.invoiceNumber}</strong>
                </p>
                <p className="text-slate-600">
                  Client: <strong>{selectedInvoiceForPayment.clientName}</strong>
                </p>
                <p className="text-slate-600">
                  Current Due:{" "}
                  <strong className="text-amber-600 font-mono">
                    {formatCurrency(selectedInvoiceForPayment.dueAmount)}
                  </strong>
                </p>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Amount (৳)</label>
                  <input
                    type="number"
                    max={selectedInvoiceForPayment.dueAmount}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800 text-sm font-bold"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceForPayment(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Confirm Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Printable Invoice */}
        {selectedInvoiceForPrint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 no-print">
                <h3 className="font-bold text-slate-900 text-base">Corporate Tax Invoice</h3>
                <button
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Invoice Page */}
              <div className="printable-area space-y-6 bg-white p-6 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between border-b-2 border-blue-600 pb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-10 h-10 text-blue-600" />
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">
                        GuardPro Security Services Bangladesh Ltd.
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Level 7, GuardPro Tower, Gulshan-2, Dhaka-1212 • Phone: +880 2 9887766
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">BIN: 004928192-0101 (NBR Registered)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-blue-700 block font-mono">
                      {selectedInvoiceForPrint.invoiceNumber}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Billing Period: {selectedInvoiceForPrint.billingPeriod}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-bold text-slate-800 uppercase text-[10px] mb-1">Invoice To:</h5>
                    <p className="font-bold text-slate-900 text-sm">{selectedInvoiceForPrint.clientName}</p>
                    <p className="text-slate-600">{selectedInvoiceForPrint.siteName}</p>
                    <p className="text-slate-500 text-[11px] mt-1">Payment Terms: Net 30 Days</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-slate-600">
                      Issue Date: <strong>{formatDate(selectedInvoiceForPrint.issueDate)}</strong>
                    </p>
                    <p className="text-slate-600">
                      Due Date: <strong>{formatDate(selectedInvoiceForPrint.dueDate)}</strong>
                    </p>
                    <p className="text-slate-600">
                      Status:{" "}
                      <strong className="text-emerald-700 font-bold">{selectedInvoiceForPrint.status}</strong>
                    </p>
                  </div>
                </div>

                {/* Line Items */}
                <table className="w-full border-t border-b border-slate-200">
                  <thead className="text-slate-600 bg-slate-50">
                    <tr>
                      <th className="py-2 text-left">Description</th>
                      <th className="py-2 text-center">Qty (Guards)</th>
                      <th className="py-2 text-right">Rate / Guard</th>
                      <th className="py-2 text-right">Amount (BDT ৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">
                        Professional Security Guard Deployment Services
                      </td>
                      <td className="py-3 text-center">{selectedInvoiceForPrint.guardQuantity}</td>
                      <td className="py-3 text-right font-mono">
                        {formatCurrency(selectedInvoiceForPrint.ratePerGuard)}
                      </td>
                      <td className="py-3 text-right font-mono font-bold">
                        {formatCurrency(selectedInvoiceForPrint.subtotal)}
                      </td>
                    </tr>
                    {selectedInvoiceForPrint.additionalCharges > 0 && (
                      <tr>
                        <td className="py-2 text-slate-600">
                          {selectedInvoiceForPrint.additionalChargesDescription || "Additional Services"}
                        </td>
                        <td className="py-2 text-center">1</td>
                        <td className="py-2 text-right font-mono">
                          {formatCurrency(selectedInvoiceForPrint.additionalCharges)}
                        </td>
                        <td className="py-2 text-right font-mono">
                          {formatCurrency(selectedInvoiceForPrint.additionalCharges)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-1 text-slate-700 text-right">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-mono">{formatCurrency(selectedInvoiceForPrint.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT ({selectedInvoiceForPrint.vatRatePercentage}%):</span>
                      <span className="font-mono">{formatCurrency(selectedInvoiceForPrint.vatAmount)}</span>
                    </div>
                    {selectedInvoiceForPrint.discountAmount > 0 && (
                      <div className="flex justify-between text-rose-600">
                        <span>Discount:</span>
                        <span className="font-mono">
                          -{formatCurrency(selectedInvoiceForPrint.discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm border-t border-slate-300 pt-2 text-slate-900">
                      <span>Total Invoice:</span>
                      <span className="text-blue-700 font-mono">
                        {formatCurrency(selectedInvoiceForPrint.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-600">
                      <span>Amount Paid:</span>
                      <span className="font-mono">{formatCurrency(selectedInvoiceForPrint.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-amber-600">
                      <span>Balance Due:</span>
                      <span className="font-mono">{formatCurrency(selectedInvoiceForPrint.dueAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex justify-between text-[10px] text-slate-400">
                  <span>Authorized Signature: Mahmudur Rahman, FCA</span>
                  <span>GuardPro Automated Billing System</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 flex gap-3 no-print">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

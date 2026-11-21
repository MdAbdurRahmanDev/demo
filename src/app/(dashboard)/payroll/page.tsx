"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Banknote,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  FileText,
  Building,
  CreditCard,
  X,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payroll");
      const json = await res.json();
      if (json.success) setPayrolls(json.data);
    } catch {
      toast.error("Error loading payroll records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleGeneratePayroll = async () => {
    if (!confirm("Generate monthly payroll sheet for all active security guards & staff?")) return;
    try {
      const res = await fetch("/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthCode: "2026-11",
          payrollMonth: "November 2026",
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Payroll sheet calculated & generated successfully!");
        fetchPayrolls();
      }
    } catch {
      toast.error("Error generating payroll");
    }
  };

  const currentPayroll = payrolls[0];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Compensation & Benefits
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Payroll & Salary Management</h1>
            <p className="text-sm text-slate-500">
              Monthly payroll calculation, overtime, festival bonuses, deductions, and printable payslips in BDT (৳).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Payroll Sheet</span>
            </button>
            <button
              onClick={handleGeneratePayroll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Monthly Payroll</span>
            </button>
          </div>
        </div>

        {/* Payroll Summary Metric Cards */}
        {currentPayroll && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Payroll Cycle</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{currentPayroll.payrollMonth}</p>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Status: {currentPayroll.status}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Total Workforce</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{currentPayroll.totalEmployees} Employees</p>
              <span className="text-[11px] text-slate-400">Guards, Gunmen & Admins</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Gross Payroll Amount</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(currentPayroll.totalGrossAmount)}
              </p>
              <span className="text-[11px] text-slate-400">Inclusive of Overtime</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Net Payable Disbursed</span>
              <p className="text-xl font-bold text-blue-600 mt-1">
                {formatCurrency(currentPayroll.totalNetPayroll)}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">Processed via BEFTN</span>
            </div>
          </div>
        )}

        {/* Detailed Payroll Register Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden printable-area">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              Disbursement Register ({currentPayroll?.payrollMonth || "Current Cycle"})
            </h3>
            <span className="text-xs font-semibold text-slate-500">Currency: Bangladeshi Taka (BDT ৳)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Basic Salary</th>
                  <th className="py-3 px-4">Allowances</th>
                  <th className="py-3 px-4">Overtime Amount</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Payable</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right no-print">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      Loading payroll disbursement sheet...
                    </td>
                  </tr>
                ) : !currentPayroll?.items?.length ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      No payroll items found. Click &apos;Generate Monthly Payroll&apos;.
                    </td>
                  </tr>
                ) : (
                  currentPayroll.items.map((item: any) => (
                    <tr key={item.employeeId} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{item.fullName}</p>
                        <span className="font-mono text-[10px] text-slate-500">{item.employeeId}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{item.designation}</td>
                      <td className="py-3 px-4 font-mono">{formatCurrency(item.basicSalary)}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {formatCurrency(item.houseRent + item.medicalAllowance + item.transportAllowance)}
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-600 font-bold">
                        {formatCurrency(item.overtimeAmount)} ({item.overtimeHours}h)
                      </td>
                      <td className="py-3 px-4 font-mono text-rose-600">
                        -{formatCurrency(item.totalDeductions)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                        {formatCurrency(item.netPayable)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{item.paymentMethod}</span>
                        <p className="text-[10px] text-slate-400 font-mono">{item.paymentReference}</p>
                      </td>
                      <td className="py-3 px-4 text-right no-print">
                        <button
                          onClick={() => setSelectedPayslip(item)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-bold border border-blue-200"
                        >
                          View Slip
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Printable Salary Payslip in BDT */}
        {selectedPayslip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 no-print">
                <h3 className="font-bold text-slate-900 text-base">Salary Payslip</h3>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Slip Paper */}
              <div className="p-6 border border-slate-300 rounded-xl space-y-4 printable-area bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-7 h-7 text-blue-600" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        GuardPro Security Services Bangladesh Ltd.
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Level 7, GuardPro Tower, Gulshan-2, Dhaka-1212
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    PAYSLIP
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Employee Name</span>
                    <strong className="text-slate-900 text-sm">{selectedPayslip.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Employee ID</span>
                    <strong className="text-slate-900 font-mono">{selectedPayslip.employeeId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Designation</span>
                    <span>{selectedPayslip.designation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pay Period</span>
                    <span>{currentPayroll?.payrollMonth || "November 2026"}</span>
                  </div>
                </div>

                {/* Earnings & Deductions Table */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">Earnings</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span className="font-mono">{formatCurrency(selectedPayslip.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>House Rent:</span>
                        <span className="font-mono">{formatCurrency(selectedPayslip.houseRent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medical Allowance:</span>
                        <span className="font-mono">{formatCurrency(selectedPayslip.medicalAllowance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transport Allowance:</span>
                        <span className="font-mono">{formatCurrency(selectedPayslip.transportAllowance)}</span>
                      </div>
                      <div className="flex justify-between text-blue-700 font-semibold">
                        <span>Overtime ({selectedPayslip.overtimeHours}h):</span>
                        <span className="font-mono">{formatCurrency(selectedPayslip.overtimeAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">Deductions</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-rose-600">
                        <span>Welfare Fund:</span>
                        <span className="font-mono">{formatCurrency(selectedPayslip.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-center text-sm font-bold">
                  <span>Net Salary Payable:</span>
                  <span className="text-base text-blue-600 font-mono">
                    {formatCurrency(selectedPayslip.netPayable)}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 pt-4 flex justify-between">
                  <span>Payment Ref: {selectedPayslip.paymentReference}</span>
                  <span>Computer Generated Payslip - No Signature Required</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-3 no-print">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Payslip</span>
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
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

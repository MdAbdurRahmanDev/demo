"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Building,
  Users,
  Shield,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("attendance");
  const [employees, setEmployees] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [resE, resI] = await Promise.all([fetch("/api/employees"), fetch("/api/invoices")]);
        const jsonE = await resE.json();
        const jsonI = await resI.json();
        if (jsonE.success) setEmployees(jsonE.data);
        if (jsonI.success) setInvoices(jsonI.data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (reportType === "employees") {
      csvContent += "Employee ID,Full Name,Designation,Department,Mobile,Status,Gross Salary\n";
      employees.forEach((e) => {
        csvContent += `"${e.employeeId}","${e.fullName}","${e.designation}","${e.department}","${e.mobileNumber}","${e.employmentStatus}","${e.salaryStructure?.grossSalary}"\n`;
      });
    } else {
      csvContent += "Invoice No,Client Name,Billing Period,Total BDT,Paid BDT,Due BDT,Status\n";
      invoices.forEach((i) => {
        csvContent += `"${i.invoiceNumber}","${i.clientName}","${i.billingPeriod}","${i.totalAmount}","${i.paidAmount}","${i.dueAmount}","${i.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `guardpro_report_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report exported to CSV");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Business Intelligence
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Reports & Executive Analytics</h1>
            <p className="text-sm text-slate-500">
              Generate, print, and export corporate attendance, guard deployment, payroll, and billing reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print View</span>
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Report Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "attendance", label: "Daily Attendance & Overtime" },
            { id: "employees", label: "Guard Personnel Directory" },
            { id: "billing", label: "Client Invoicing & Receivables" },
            { id: "pnl", label: "Profit & Loss Summary" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                reportType === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Report Preview Container */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm printable-area">
          <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base uppercase">
                GuardPro Operational Report: {reportType.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-500">
                Generated from Live Database • All Bangladesh Branches
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded">
              OFFICIAL RECORD
            </span>
          </div>

          {reportType === "employees" ? (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Full Name</th>
                    <th className="py-2 px-3">Designation</th>
                    <th className="py-2 px-3">Mobile Number</th>
                    <th className="py-2 px-3">NID Number</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Gross (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((e) => (
                    <tr key={e._id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{e.employeeId}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{e.fullName}</td>
                      <td className="py-2.5 px-3 text-slate-600">{e.designation}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{e.mobileNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{e.nidNumber}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-emerald-700">{e.employmentStatus}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {formatCurrency(e.salaryStructure?.grossSalary || 20000)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2 px-3">Invoice</th>
                    <th className="py-2 px-3">Client Company</th>
                    <th className="py-2 px-3">Billing Cycle</th>
                    <th className="py-2 px-3">Guards Deployed</th>
                    <th className="py-2 px-3">Total Invoiced</th>
                    <th className="py-2 px-3">Paid (BDT)</th>
                    <th className="py-2 px-3">Due Balance</th>
                    <th className="py-2 px-3 text-right">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((i) => (
                    <tr key={i._id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{i.invoiceNumber}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{i.clientName}</td>
                      <td className="py-2.5 px-3 text-slate-600">{i.billingPeriod}</td>
                      <td className="py-2.5 px-3 text-center">{i.guardQuantity}</td>
                      <td className="py-2.5 px-3 font-mono font-bold">{formatCurrency(i.totalAmount)}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-600">
                        {formatCurrency(i.paidAmount)}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600">
                        {formatCurrency(i.dueAmount)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {i.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

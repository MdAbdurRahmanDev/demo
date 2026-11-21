"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  IdCard,
  Phone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  Shield,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [idCardEmployee, setIdCardEmployee] = useState<any>(null);

  // New Employee Form state
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "1994-05-15",
    gender: "Male",
    nidNumber: "",
    mobileNumber: "",
    bloodGroup: "B+",
    presentAddress: "",
    permanentAddress: "",
    designation: "Security Guard",
    department: "Operations",
    branch: "Dhaka Head Office",
    joiningDate: "2024-01-15",
    basicSalary: 12000,
    houseRent: 4000,
    medical: 1500,
    transport: 1500,
    foodAllowance: 1000,
    paymentMethod: "Bank",
    accountNumber: "",
    bankName: "BRAC Bank Ltd.",
    emergencyName: "",
    emergencyRelation: "Father",
    emergencyPhone: "",
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (department !== "All") params.append("department", department);
      if (status !== "All") params.append("status", status);

      const res = await fetch(`/api/employees?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setEmployees(json.data);
      }
    } catch {
      toast.error("Error loading employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [department, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.nidNumber || !formData.mobileNumber) {
      toast.error("Please fill in required fields (Name, NID, Mobile)");
      return;
    }

    try {
      const gross =
        Number(formData.basicSalary) +
        Number(formData.houseRent) +
        Number(formData.medical) +
        Number(formData.transport) +
        Number(formData.foodAllowance);

      const payload = {
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nidNumber: formData.nidNumber,
        mobileNumber: formData.mobileNumber,
        bloodGroup: formData.bloodGroup,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        designation: formData.designation,
        department: formData.department,
        branch: formData.branch,
        joiningDate: formData.joiningDate,
        employmentStatus: "Active",
        salaryStructure: {
          basic: Number(formData.basicSalary),
          houseRent: Number(formData.houseRent),
          medical: Number(formData.medical),
          transport: Number(formData.transport),
          foodAllowance: Number(formData.foodAllowance),
          grossSalary: gross,
        },
        paymentMethod: formData.paymentMethod,
        accountDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          mobileBankingNumber: formData.paymentMethod !== "Bank" ? formData.mobileNumber : undefined,
        },
        emergencyContact: {
          name: formData.emergencyName,
          relation: formData.emergencyRelation,
          phone: formData.emergencyPhone,
        },
      };

      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Employee ${json.data.fullName} registered successfully!`);
        setShowAddModal(false);
        fetchEmployees();
      } else {
        toast.error(json.error || "Failed to create employee");
      }
    } catch {
      toast.error("Error creating employee");
    }
  };

  const openProfileModal = async (emp: any) => {
    setSelectedEmployee(emp);
    setActiveTab("overview");
    try {
      const res = await fetch(`/api/employees/${emp._id}`);
      const json = await res.json();
      if (json.success) {
        setProfileData(json.data);
      }
    } catch {
      toast.error("Error loading profile details");
    }
  };

  const openIdCardModal = (emp: any) => {
    setIdCardEmployee(emp);
    setShowIdCardModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove employee ${name}?`)) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Employee removed");
        fetchEmployees();
      }
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Workforce Directory
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Employee Management</h1>
            <p className="text-sm text-slate-500">
              Manage security guards, supervisors, administrative staff, payroll details, and ID badges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, NID, or phone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Operations">Operations</option>
              <option value="Administration">Administration</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="On Leave">On Leave</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Designation & Dept</th>
                  <th className="py-3 px-4">NID & Mobile</th>
                  <th className="py-3 px-4">Joining Date</th>
                  <th className="py-3 px-4">Gross Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Loading employee records...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No employees found matching criteria.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                            {emp.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{emp.fullName}</p>
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {emp.employeeId}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{emp.designation}</p>
                        <p className="text-slate-500">{emp.department}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{emp.mobileNumber}</p>
                        <p className="text-slate-400 text-[11px]">NID: {emp.nidNumber}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{formatDate(emp.joiningDate)}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {formatCurrency(emp.salaryStructure?.grossSalary || 20000)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            emp.employmentStatus === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : emp.employmentStatus === "On Leave"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {emp.employmentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openProfileModal(emp)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openIdCardModal(emp)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                            title="Generate ID Badge"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id, emp.fullName)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal 1: Add New Employee */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New Employee / Security Guard</h3>
                  <p className="text-xs text-slate-500">Register employee with Bangladesh NID & Salary</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEmployee} className="p-6 space-y-4 text-xs">
                {/* Personal Information */}
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-1">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Md. Anisur Rahman"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Father&apos;s Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fatherName}
                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                        placeholder="Father's name"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mother&apos;s Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.motherName}
                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                        placeholder="Mother's name"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">NID Number (10 or 17 digit) *</label>
                      <input
                        type="text"
                        required
                        value={formData.nidNumber}
                        onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                        placeholder="e.g. 19942692012000555"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mobile Number (BD) *</label>
                      <input
                        type="text"
                        required
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Designation & Deployment */}
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-1">
                    Designation & Official Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                      <select
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      >
                        <option value="Security Guard">Security Guard</option>
                        <option value="Senior Security Guard">Senior Security Guard</option>
                        <option value="Security Supervisor">Security Supervisor</option>
                        <option value="Armed Gunman">Armed Gunman</option>
                        <option value="Field Officer">Field Officer</option>
                        <option value="Admin Executive">Admin Executive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      >
                        <option value="Operations">Operations</option>
                        <option value="Administration">Administration</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-1">
                    Addresses
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Present Address</label>
                      <input
                        type="text"
                        value={formData.presentAddress}
                        onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                        placeholder="House/Road, Thana, District"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Permanent Address</label>
                      <input
                        type="text"
                        value={formData.permanentAddress}
                        onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                        placeholder="Village, Post Office, Upazila, District"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Salary Structure in BDT */}
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-1">
                    Monthly Salary Structure (BDT ৳)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Basic (৳)</label>
                      <input
                        type="number"
                        value={formData.basicSalary}
                        onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">House Rent (৳)</label>
                      <input
                        type="number"
                        value={formData.houseRent}
                        onChange={(e) => setFormData({ ...formData, houseRent: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Medical (৳)</label>
                      <input
                        type="number"
                        value={formData.medical}
                        onChange={(e) => setFormData({ ...formData, medical: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Transport (৳)</label>
                      <input
                        type="number"
                        value={formData.transport}
                        onChange={(e) => setFormData({ ...formData, transport: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm"
                  >
                    Save & Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: View Employee Full Profile with Tabs */}
        {selectedEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {selectedEmployee.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedEmployee.fullName}</h3>
                    <p className="text-xs text-slate-500">
                      ID: <span className="font-mono font-bold text-blue-600">{selectedEmployee.employeeId}</span> •{" "}
                      {selectedEmployee.designation} • {selectedEmployee.branch}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Bar */}
              <div className="flex border-b border-slate-200 px-6 gap-6 text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-3 border-b-2 transition ${
                    activeTab === "overview"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  Personal Overview
                </button>
                <button
                  onClick={() => setActiveTab("guard")}
                  className={`py-3 border-b-2 transition ${
                    activeTab === "guard"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  Guard Profile & Verification
                </button>
                <button
                  onClick={() => setActiveTab("salary")}
                  className={`py-3 border-b-2 transition ${
                    activeTab === "salary"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  Salary & Banking
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`py-3 border-b-2 transition ${
                    activeTab === "history"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  Duty & Attendance History
                </button>
              </div>

              <div className="p-6 text-xs">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">National ID (NID)</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          {selectedEmployee.nidNumber}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">Mobile Phone</span>
                        <span className="font-semibold text-slate-800">{selectedEmployee.mobileNumber}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">Blood Group</span>
                        <span className="font-bold text-rose-600">{selectedEmployee.bloodGroup}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">Father&apos;s Name</span>
                        <span className="font-semibold text-slate-800">{selectedEmployee.fatherName}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">Mother&apos;s Name</span>
                        <span className="font-semibold text-slate-800">{selectedEmployee.motherName}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">Emergency Contact</span>
                        <span className="font-semibold text-slate-800">
                          {selectedEmployee.emergencyContact?.name} ({selectedEmployee.emergencyContact?.relation}) -{" "}
                          {selectedEmployee.emergencyContact?.phone}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                      <div>
                        <strong className="text-slate-700">Present Address: </strong>
                        <span className="text-slate-600">{selectedEmployee.presentAddress}</span>
                      </div>
                      <div>
                        <strong className="text-slate-700">Permanent Address: </strong>
                        <span className="text-slate-600">{selectedEmployee.permanentAddress}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "guard" && (
                  <div className="space-y-4">
                    {profileData?.guardProfile ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <span className="text-blue-600 block mb-0.5 font-semibold">Security Badge No.</span>
                          <span className="font-mono font-bold text-blue-900 text-base">
                            {profileData.guardProfile.badgeNumber}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Police Verification</span>
                          <span className="font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {profileData.guardProfile.policeVerificationStatus}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Medical Fitness</span>
                          <span className="font-bold text-slate-800">
                            {profileData.guardProfile.medicalFitnessStatus}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Height & Weight</span>
                          <span className="font-semibold text-slate-800">
                            {profileData.guardProfile.heightFeet}&apos;{profileData.guardProfile.heightInches}&quot; •{" "}
                            {profileData.guardProfile.weightKg} kg
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Current Site Post</span>
                          <span className="font-semibold text-slate-800">
                            {profileData.guardProfile.currentSiteName || "Available / Unassigned"}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block mb-0.5">Current Shift</span>
                          <span className="font-semibold text-blue-600">
                            {profileData.guardProfile.currentShift || "Morning Shift"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-lg">
                        This employee is not classified as an operational field guard.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "salary" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">Basic Salary</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrency(selectedEmployee.salaryStructure?.basic || 12000)}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">House Rent</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrency(selectedEmployee.salaryStructure?.houseRent || 4000)}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">Medical</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrency(selectedEmployee.salaryStructure?.medical || 1500)}
                        </span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <span className="text-blue-600 font-semibold block">Gross Monthly Salary</span>
                        <span className="font-bold text-blue-900 text-base">
                          {formatCurrency(selectedEmployee.salaryStructure?.grossSalary || 20000)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-800 mb-1">Payment Method & Bank Account</p>
                      <p className="text-slate-600">
                        Method: <strong className="text-slate-800">{selectedEmployee.paymentMethod}</strong>
                      </p>
                      {selectedEmployee.paymentMethod === "Bank" ? (
                        <p className="text-slate-600 mt-1">
                          Bank: {selectedEmployee.accountDetails?.bankName} • Account:{" "}
                          <span className="font-mono font-semibold">{selectedEmployee.accountDetails?.accountNumber || "N/A"}</span>
                        </p>
                      ) : (
                        <p className="text-slate-600 mt-1">
                          Mobile Wallet:{" "}
                          <span className="font-mono font-semibold">
                            {selectedEmployee.accountDetails?.mobileBankingNumber || selectedEmployee.mobileNumber}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800">Recent Attendance Records</h4>
                    {profileData?.attendanceHistory?.length ? (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                        {profileData.attendanceHistory.map((att: any) => (
                          <div key={att._id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                            <div>
                              <p className="font-semibold text-slate-800">{att.siteName}</p>
                              <p className="text-[11px] text-slate-400">{formatDate(att.date)}</p>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                {att.status}
                              </span>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                In: {att.checkInTime} • Out: {att.checkOutTime || "-"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 py-4 text-center">No attendance history logged yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Printable Employee Security ID Badge */}
        {showIdCardModal && idCardEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Employee Security ID Card</h3>
                <button
                  onClick={() => setShowIdCardModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ID Badge Front */}
              <div className="bg-gradient-to-b from-blue-700 to-blue-900 text-white rounded-xl p-5 shadow-lg border-2 border-blue-500 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-blue-500/50 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-white" />
                    <div>
                      <h4 className="font-extrabold text-xs tracking-wider uppercase">GuardPro Security</h4>
                      <p className="text-[9px] text-blue-200">Bangladesh Ltd.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono bg-blue-800 px-2 py-0.5 rounded border border-blue-400">
                    IDENTITY CARD
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-20 h-24 rounded-lg bg-white/10 border-2 border-white/30 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {idCardEmployee.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left space-y-1">
                    <h5 className="font-bold text-sm text-white">{idCardEmployee.fullName}</h5>
                    <p className="text-xs text-blue-200 font-semibold">{idCardEmployee.designation}</p>
                    <p className="text-[10px] text-blue-300 font-mono">ID: {idCardEmployee.employeeId}</p>
                    <p className="text-[10px] text-blue-300">Blood: <strong className="text-white">{idCardEmployee.bloodGroup}</strong></p>
                    <p className="text-[10px] text-blue-300">NID: {idCardEmployee.nidNumber}</p>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-blue-500/50 flex items-center justify-between text-[9px] text-blue-200">
                  <span>Emergency: {idCardEmployee.mobileNumber}</span>
                  <span className="font-mono">Gulshan-2, Dhaka</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print ID Card</span>
                </button>
                <button
                  onClick={() => setShowIdCardModal(false)}
                  className="py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
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

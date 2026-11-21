"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@guardpro.com.bd");
  const [password, setPassword] = useState("Admin@123456");
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { role: "Super Admin", email: "admin@guardpro.com.bd", pass: "Admin@123456", name: "Brig. Gen. Tariqul Islam" },
    { role: "Operations Manager", email: "operations@guardpro.com.bd", pass: "Admin@123456", name: "Kamrul Ahsan" },
    { role: "HR Manager", email: "hr@guardpro.com.bd", pass: "Admin@123456", name: "Sharmin Sultana" },
    { role: "Accountant", email: "accounts@guardpro.com.bd", pass: "Admin@123456", name: "Mahmudur Rahman, FCA" },
    { role: "Supervisor", email: "supervisor@guardpro.com.bd", pass: "Admin@123456", name: "Kabir Hossain" },
    { role: "Security Guard", email: "guard@guardpro.com.bd", pass: "Admin@123456", name: "Md. Rafiqul Islam" },
    { role: "Client Admin", email: "client@grameenphone.com", pass: "Admin@123456", name: "Grameenphone Security" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Welcome back, ${json.user.name}!`);
        router.push("/");
      } else {
        toast.error(json.error || "Login failed");
      }
    } catch {
      toast.error("Error connecting to authentication service");
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (acc: any) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    toast.info(`Filled credentials for ${acc.role}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md mb-3">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">GuardPro Security BD</h2>
        <p className="mt-1 text-xs text-slate-500">Enterprise Security Company Operations Management System</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corporate Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm mt-2"
            >
              <span>{loading ? "Verifying..." : "Sign In to GuardPro"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Role Switcher */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Quick 1-Click Role Switcher
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => selectRole(acc)}
                  className={`p-2 rounded-lg text-left border transition ${
                    email === acc.email
                      ? "border-blue-600 bg-blue-50 text-blue-800 font-bold"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <p className="truncate font-semibold">{acc.role}</p>
                  <p className="text-[9px] text-slate-400 truncate">{acc.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

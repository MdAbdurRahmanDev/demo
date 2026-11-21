import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payroll from "@/models/Payroll";
import Employee from "@/models/Employee";

export async function GET() {
  try {
    await connectDB();
    const payrolls = await Payroll.find().sort({ monthCode: -1 });
    return NextResponse.json({ success: true, data: payrolls });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { monthCode, payrollMonth } = body;

    const employees = await Employee.find({ employmentStatus: "Active" });

    const items = employees.map((emp) => {
      const basic = emp.salaryStructure.basic || 12000;
      const house = emp.salaryStructure.houseRent || 4000;
      const med = emp.salaryStructure.medical || 1500;
      const trans = emp.salaryStructure.transport || 1500;
      const overtimeHours = 4;
      const overtimeAmount = Math.round((basic / 208) * 1.5 * overtimeHours);
      const bonus = 1000;
      const attendanceBonus = 500;
      const gross = basic + house + med + trans + overtimeAmount + bonus + attendanceBonus;
      const deductions = 500;
      const net = gross - deductions;

      return {
        employeeId: emp.employeeId,
        fullName: emp.fullName,
        designation: emp.designation,
        branch: emp.branch,
        basicSalary: basic,
        houseRent: house,
        medicalAllowance: med,
        transportAllowance: trans,
        overtimeHours,
        overtimeAmount,
        bonus,
        attendanceBonus,
        advanceDeduction: 0,
        absenceDeduction: 0,
        totalGross: gross,
        totalDeductions: deductions,
        netPayable: net,
        paymentMethod: emp.paymentMethod || "Bank",
        paymentStatus: "Paid",
        paymentReference: `BEFTN-${Math.floor(100000 + Math.random() * 900000)}`,
        paidAt: new Date(),
      };
    });

    const totalGross = items.reduce((acc, i) => acc + i.totalGross, 0);
    const totalDeductions = items.reduce((acc, i) => acc + i.totalDeductions, 0);
    const totalNet = items.reduce((acc, i) => acc + i.netPayable, 0);

    const payroll = await Payroll.findOneAndUpdate(
      { monthCode },
      {
        payrollMonth: payrollMonth || "Current Month",
        monthCode,
        totalEmployees: items.length,
        totalGrossAmount: totalGross,
        totalDeductionAmount: totalDeductions,
        totalNetPayroll: totalNet,
        status: "Paid",
        approvedBy: "Managing Director",
        approvedAt: new Date(),
        items,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: payroll });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

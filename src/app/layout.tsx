import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GuardPro - Security Company Management System",
  description: "Enterprise SaaS Security Guard & Operations Management System for Bangladesh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A]">{children}</body>
    </html>
  );
}

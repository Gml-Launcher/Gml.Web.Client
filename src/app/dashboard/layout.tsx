import { Header } from "@/shared/ui/Header";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex gap-x-6 h-screen">
      <Header />
      <div className="w-full flex flex-col p-8 gap-y-8">{children}</div>
    </div>
  );
}

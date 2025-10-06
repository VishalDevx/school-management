// app/components/Layout.tsx
"use client";



import { adminNav, staffNav, studentNav } from "@/config/SidebarItem";
import { useState } from "react";
import SideBar from "./Sidebar";




type Role = "admin" | "staff" | "student";

interface LayoutProps {
  children: React.ReactNode;
  role: Role; // pass logged-in user role
}

export default function Layout({ children, role }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  let navItems;
  if (role === "admin") navItems = adminNav;
  else if (role === "staff") navItems = staffNav;
  else navItems = studentNav;

  return (
    <div className="flex">
      <SideBar collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)} navItems={navItems} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

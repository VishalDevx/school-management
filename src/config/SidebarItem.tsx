// app/config/sidebars.tsx
import React from "react";
import { BanknoteArrowDown, BookCheck, ChartPie, Fingerprint, HandCoins, LogOut, UserPen, Users } from "lucide-react";
export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const adminNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <ChartPie /> },
  { href: "/student/class", label: "Students", icon: <Users /> },
  { href: "/staff", label: "Teacher", icon: <UserPen /> },
  { href: "/fee-management", label: "Fee Management", icon: <HandCoins /> },
  { href: "/result", label: "Results", icon: <BookCheck /> },
  { href: "/generate-id", label: "Generate ID", icon: <Fingerprint /> },
  { href: "/expense", label: "School Expense", icon: <BanknoteArrowDown /> },
  { href: "/logout", label: "Logout", icon: <LogOut /> },
];

export const staffNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <ChartPie /> },
  { href: "/my-students", label: "My Students", icon: <Users /> },
  { href: "/results", label: "Results", icon: <BookCheck /> },
  { href: "/generate-id", label: "Generate ID", icon: <Fingerprint /> },
  { href: "/logout", label: "Logout", icon: <LogOut /> },
];

export const studentNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <ChartPie /> },
  { href: "/my-results", label: "My Results", icon: <BookCheck /> },
  { href: "/fee-status", label: "Fee Status", icon: <HandCoins /> },
  { href: "/logout", label: "Logout", icon: <LogOut /> },
];

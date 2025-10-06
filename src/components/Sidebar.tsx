// app/components/SideBar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { NavItem } from "@/config/SidebarItem";


interface SideBarProps {
  collapsed: boolean;
  toggleCollapsed?: () => void;
  navItems: NavItem[];
}

const SideBar: React.FC<SideBarProps> = ({ collapsed, toggleCollapsed, navItems }) => {
  const pathname = usePathname();

  return (
    <motion.div
      animate={{ width: collapsed ? 64 : 320 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="h-screen flex flex-col rounded-3xl shadow-2xl bg-gray-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="RGD" width={40} height={40} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-gray-800"
              >
                RGD <span className="text-blue-600">स्कूल</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {toggleCollapsed && (
          <button
            onClick={toggleCollapsed}
            className="rounded hover:bg-gray-200 text-gray-600 flex items-center justify-center"
          >
            {!collapsed ? "←" : "→"}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col p-4 gap-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-gray-500 text-xs">
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              key="footer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              © 2025 RGD School
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SideBar;

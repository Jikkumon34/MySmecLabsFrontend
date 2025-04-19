// components/Sidebar.tsx
import React from "react";
import { NavLink } from "@/data/navLinks";
import Link from "next/link";
interface SidebarProps {
  isOpen: boolean;
  navLinks: NavLink[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, navLinks }) => {
  return (
    <aside
      id="sidebar"
      className={`sidebar-transition bg-gradient-to-b from-[#2E3192] to-[#0071BC] w-64 h-screen shadow-lg fixed z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <h2 className="text-white text-2xl font-bold text-center">MySmecLabs</h2>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="flex items-center space-x-3 text-white p-3 rounded-lg hover:bg-white/10"
              >
                <span className="material-icons">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

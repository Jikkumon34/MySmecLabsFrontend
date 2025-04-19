// components/DashboardLayout.tsx
"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { roleNavLinks } from "@/data/navLinks";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "student" | "admin" | "staff";
  username: string;
}

export default function DashboardLayout({
  children,
  role,
  username,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Map roles to navbar titles
  const roleTitles: { [key: string]: string } = {
    student: "Student Dashboard",
    admin: "Admin Dashboard",
    staff: "Staff Dashboard",
  };
  const title = roleTitles[role] || "Dashboard";

  // Open sidebar by default on desktop
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Optional: Listen to window resize events to ensure desktop always shows the sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex relative" id="wrapper">
      <Sidebar isOpen={isSidebarOpen} navLinks={roleNavLinks[role]} />
      {/* Mobile overlay */}
      <div
        id="sidebar-overlay"
        className={`fixed inset-0 bg-black opacity-50 z-30 md:hidden ${
          isSidebarOpen ? "" : "hidden"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <div
        id="main-content"
        className={`flex-1 sidebar-transition ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        } w-full`}
      >
        <Navbar toggleSidebar={toggleSidebar} title={title} username={username} />
        {children}
      </div>
    </div>
  );
}

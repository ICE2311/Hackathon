"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { maintenanceRequestAPI } from "@/lib/api";

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const { data: kanbanData } = useQuery({
    queryKey: ["kanban"],
    queryFn: async () => {
      const response = await maintenanceRequestAPI.getKanban();
      return response.data;
    },
    refetchInterval: 30000,
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Define all possible navigation links with role requirements
  const allNavLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      roles: ["ADMIN", "MANAGER", "TECHNICIAN", "EMPLOYEE"],
    },
    { href: "/my-requests", label: "My Requests", roles: ["EMPLOYEE"] },
    {
      href: "/kanban",
      label: "Kanban",
      roles: ["ADMIN", "MANAGER", "TECHNICIAN"],
    },
    {
      href: "/schedule",
      label: "Schedule",
      roles: ["ADMIN", "MANAGER", "TECHNICIAN"],
    },
    {
      href: "/equipment",
      label: "Equipment",
      roles: ["ADMIN", "MANAGER", "TECHNICIAN"],
    },
    {
      href: "/teams",
      label: "Teams",
      roles: ["ADMIN", "MANAGER", "TECHNICIAN"],
    },
  ];

  // Filter navigation links based on user role
  const navLinks = allNavLinks.filter(
    (link) => user && link.roles.includes(user.role)
  );

  // Get notification counts
  const newRequestsCount = kanbanData?.NEW?.length || 0;
  const overdueRequests = [
    ...(kanbanData?.NEW || []),
    ...(kanbanData?.IN_PROGRESS || []),
  ].filter((req) => req.isOverdue);
  const overdueCount = overdueRequests.length;
  const totalNotifications = newRequestsCount + overdueCount;

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-8">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none bg-gray-50/50 hover:bg-gray-100 transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <Link
              href="/dashboard"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
            >
              GearGuard
            </Link>

            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-700 shadow-sm transform scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Notification Bell */}
            {/* ... (existing notification code) ... */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {totalNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border-2 border-white">
                    {totalNotifications}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 z-50 ring-1 ring-black ring-opacity-5 animate-fade-in overflow-hidden">
                  {/* ... content ... */}
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {overdueCount > 0 && (
                      <div className="p-4 bg-red-50/50 border-b border-red-100 hover:bg-red-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <span className="text-red-500 text-xl">⚠️</span>
                          <div>
                            <p className="font-medium text-red-900 text-sm">
                              {overdueCount} Overdue Request(s)
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                              Action required immediately
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {newRequestsCount > 0 && (
                      <div className="p-4 bg-blue-50/50 border-b border-blue-100 hover:bg-blue-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <span className="text-blue-500 text-xl">📋</span>
                          <div>
                            <p className="font-medium text-blue-900 text-sm">
                              {newRequestsCount} New Request(s)
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Waiting to be assigned
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {totalNotifications === 0 && (
                      <div className="p-8 text-center text-gray-400">
                        <p className="text-sm">All caught up! 🎉</p>
                      </div>
                    )}
                    <div className="p-2 bg-gray-50/50 border-t border-gray-100">
                      <Link
                        href="/kanban"
                        onClick={() => setShowNotifications(false)}
                        className="block w-full py-2 text-center text-xs text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        View Kanban Board
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                {user?.firstName}
              </p>
              <p className="text-xs text-gray-500 font-medium capitalize px-2 py-0.5 bg-gray-100 rounded-full inline-block mt-0.5">
                {user?.role?.toLowerCase()}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 focus:outline-none transition-colors border-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-white border-t border-gray-100 animate-fade-in`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === link.href
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-4 pt-4 pb-2 px-3">
            <div className="flex items-center mb-3">
              <div className="ml-0">
                <div className="text-base font-medium text-gray-800">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm font-medium text-gray-500 capitalize">
                  {user?.role?.toLowerCase()}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

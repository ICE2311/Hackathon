"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { maintenanceRequestAPI, equipmentAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { data: metrics } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const response = await maintenanceRequestAPI.getMetrics();
      return response.data;
    },
  });

  const { data: equipment } = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const response = await equipmentAPI.getAll();
      return response.data;
    },
  });

  const stats = {
    totalRequests: metrics?.created?.current || 0,
    requestTrend: metrics?.created?.trend || 0,
    completed: metrics?.repaired?.current || 0,
    completedTrend: metrics?.repaired?.trend || 0,
    avgDuration: metrics?.avgDuration ? metrics.avgDuration.toFixed(1) : "0",
    completionRate: metrics?.completionRate
      ? metrics.completionRate.toFixed(0)
      : "0",
    activeEquipment:
      equipment?.filter((e: any) => e.status === "ACTIVE").length || 0,
  };

  const renderTrend = (value: number) => {
    if (value === 0) return <span className="text-gray-500 text-xs">− 0%</span>;
    const isPositive = value > 0;
    return (
      <span
        className={`text-xs font-medium ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? "↑" : "↓"} {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monthly Performance Metrics & Overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">
              Monthly Requests
            </h3>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalRequests}
              </p>
              {renderTrend(stats.requestTrend)}
            </div>
            <p className="text-xs text-gray-400 mt-1">vs last month</p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">
              Completed Repairs
            </h3>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-3xl font-bold text-green-600">
                {stats.completed}
              </p>
              {renderTrend(stats.completedTrend)}
            </div>
            <p className="text-xs text-gray-400 mt-1">vs last month</p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">
              Avg. Repair Time
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.avgDuration}{" "}
              <span className="text-sm text-gray-500">hrs</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Technical efficiency</p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">
              Completion Rate
            </h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {stats.completionRate}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-indigo-600 h-1.5 rounded-full"
                style={{
                  width: `${Math.min(parseInt(stats.completionRate), 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Activity
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={metrics?.history || []}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCreat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0,0,0,0.1)"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) =>
                    str ? str.split("-")[1] + "/" + str.split("-")[2] : ""
                  }
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  name="Requests Created"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorCreat)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="repaired"
                  name="Repairs Completed"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorRep)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/kanban"
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📋 Kanban Board
            </h3>
            <p className="text-gray-600 text-sm">
              Manage requests with drag & drop
            </p>
          </Link>
          <Link
            href="/equipment"
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔧 Equipment
            </h3>
            <p className="text-gray-600 text-sm">
              {stats.activeEquipment} active equipment items
            </p>
          </Link>
          <Link
            href="/teams"
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              👥 Teams
            </h3>
            <p className="text-gray-600 text-sm">Manage maintenance teams</p>
          </Link>
          <Link
            href="/calendar"
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📅 Calendar
            </h3>
            <p className="text-gray-600 text-sm">
              Schedule preventive maintenance
            </p>
          </Link>
          <Link
            href="/requests/new"
            className="card hover:shadow-lg transition-shadow cursor-pointer bg-blue-50 border-2 border-blue-200"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              ➕ New Request
            </h3>
            <p className="text-blue-700 text-sm">Create maintenance request</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

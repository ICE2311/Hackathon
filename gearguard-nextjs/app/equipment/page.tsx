"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { equipmentAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { Equipment } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { canViewEquipment } from "@/lib/permissions";

export default function EquipmentPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState({ department: "", status: "ACTIVE" });

  const { data: equipment, isLoading } = useQuery<Equipment[]>({
    queryKey: ["equipment", filter],
    queryFn: async () => {
      const response = await equipmentAPI.getAll(filter);
      return response.data;
    },
    enabled: canViewEquipment(user),
  });

  // Check if user has access
  if (!canViewEquipment(user)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to view equipment.
            </p>
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
            <p className="text-gray-600 mt-1">
              Manage your equipment inventory
            </p>
          </div>
          <Link href="/equipment/new" className="btn btn-primary">
            + Add Equipment
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Department</label>
              <select
                className="input"
                value={filter.department}
                onChange={(e) =>
                  setFilter({ ...filter, department: e.target.value })
                }
              >
                <option value="">All Departments</option>
                <option value="Production">Production</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="IT">IT</option>
                <option value="Facilities">Facilities</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="SCRAPPED">Scrapped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment List */}
        {isLoading ? (
          <div className="text-center py-12">Loading equipment...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment?.map((item) => (
              <Link
                key={item.id}
                href={`/equipment/${item.id}`}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Serial:</span>{" "}
                    {item.serialNumber}
                  </p>
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {item.department}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {item.category}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {item.location}
                  </p>
                  {item._count && (
                    <p className="mt-2 pt-2 border-t border-gray-200">
                      <span className="font-medium text-blue-600">
                        {item._count.maintenanceRequests} maintenance requests
                      </span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {equipment?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No equipment found. Try adjusting your filters.
          </div>
        )}
      </main>
    </div>
  );
}

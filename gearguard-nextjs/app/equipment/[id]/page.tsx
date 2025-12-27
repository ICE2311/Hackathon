"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { equipmentAPI, maintenanceRequestAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import { useParams, useRouter } from "next/navigation";
import { Equipment } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: equipment, isLoading } = useQuery<Equipment>({
    queryKey: ["equipment", id],
    queryFn: async () => {
      const response = await equipmentAPI.getOne(id);
      return response.data;
    },
  });

  const { data: requests } = useQuery({
    queryKey: ["equipment-requests", id],
    queryFn: async () => {
      const response = await maintenanceRequestAPI.getAll({ equipmentId: id });
      return response.data;
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: (data: any) => maintenanceRequestAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment-requests", id] });
      router.push("/kanban");
    },
  });

  const handleQuickRequest = () => {
    if (equipment) {
      createRequestMutation.mutate({
        subject: `Maintenance for ${equipment.name}`,
        description: "Quick maintenance request created from equipment page",
        type: "CORRECTIVE",
        equipmentId: equipment.id,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading equipment...</div>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Equipment not found</p>
            <Link
              href="/equipment"
              className="text-blue-600 hover:underline mt-4 inline-block"
            >
              Back to Equipment
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
        <div className="mb-6">
          <Link
            href="/equipment"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Equipment
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {equipment.name}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Serial: {equipment.serialNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    equipment.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {equipment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Department
                  </p>
                  <p className="text-gray-900">{equipment.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-gray-900">{equipment.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{equipment.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Purchase Date
                  </p>
                  <p className="text-gray-900">
                    {format(new Date(equipment.purchaseDate), "MMM dd, yyyy")}
                  </p>
                </div>
                {equipment.warrantyExpiry && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Warranty Expiry
                    </p>
                    <p className="text-gray-900">
                      {format(
                        new Date(equipment.warrantyExpiry),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                )}
                {equipment.assignedEmployee && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Assigned To
                    </p>
                    <p className="text-gray-900">
                      {equipment.assignedEmployee.firstName}{" "}
                      {equipment.assignedEmployee.lastName}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance History */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Maintenance History
              </h2>
              {requests && requests.length > 0 ? (
                <div className="space-y-3">
                  {requests.map((request: any) => (
                    <div
                      key={request.id}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {request.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            {request.description}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            request.stage === "REPAIRED"
                              ? "bg-green-100 text-green-800"
                              : request.stage === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.stage}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(request.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No maintenance history
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleQuickRequest}
                  disabled={equipment.status === "SCRAPPED"}
                  className="w-full btn btn-primary"
                >
                  🔧 Create Maintenance Request
                </button>
                <Link
                  href={`/equipment/${id}/edit`}
                  className="w-full btn btn-secondary block text-center"
                >
                  ✏️ Edit Equipment
                </Link>
              </div>
            </div>

            {equipment.defaultMaintenanceTeam && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Default Team
                </h3>
                <p className="text-gray-900">
                  {equipment.defaultMaintenanceTeam.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

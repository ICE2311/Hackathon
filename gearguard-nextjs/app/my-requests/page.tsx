"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { maintenanceRequestAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export default function MyRequestsPage() {
  const { user } = useAuth();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["my-requests", user?.id],
    queryFn: async () => {
      const response = await maintenanceRequestAPI.getAll({
        createdById: user?.id,
      });
      return response.data;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
            <p className="text-gray-600 mt-1">
              View and manage your maintenance requests
            </p>
          </div>
          <Link href="/requests/new" className="btn btn-primary">
            + New Request
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading your requests...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests?.map((request: any) => (
              <Link
                key={request.id}
                href={`/requests/${request.id}/edit`}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {request.subject}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {request.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.stage === "NEW"
                          ? "bg-gray-100 text-gray-800"
                          : request.stage === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : request.stage === "REPAIRED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.stage.replace("_", " ")}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        request.type === "PREVENTIVE"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {request.type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Equipment:</span>{" "}
                    {request.equipment?.name}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {format(new Date(request.createdAt), "MMM dd, yyyy")}
                  </div>
                  {request.scheduledDate && (
                    <div>
                      <span className="font-medium">Scheduled:</span>{" "}
                      {format(new Date(request.scheduledDate), "MMM dd, yyyy")}
                    </div>
                  )}
                  {request.assignedTechnician && (
                    <div>
                      <span className="font-medium">Assigned to:</span>{" "}
                      {request.assignedTechnician.firstName}{" "}
                      {request.assignedTechnician.lastName}
                    </div>
                  )}
                </div>

                {request.isOverdue &&
                  request.stage !== "REPAIRED" &&
                  request.stage !== "SCRAP" && (
                    <div className="mt-3 text-sm font-medium text-red-600">
                      ⚠️ OVERDUE
                    </div>
                  )}
              </Link>
            ))}
          </div>
        )}

        {requests?.length === 0 && (
          <div className="text-center py-12 card">
            <p className="text-gray-500 mb-4">
              You haven't created any requests yet.
            </p>
            <Link href="/requests/new" className="btn btn-primary">
              Create Your First Request
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

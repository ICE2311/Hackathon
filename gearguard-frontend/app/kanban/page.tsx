"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { maintenanceRequestAPI } from "@/lib/api";
import { MaintenanceRequest, KanbanData } from "@/lib/types";
import RequestCard from "@/components/Kanban/RequestCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { canAccessKanban } from "@/lib/permissions";
import Link from "next/link";

const STAGES = [
  { key: "NEW", label: "New", color: "bg-gray-100" },
  { key: "IN_PROGRESS", label: "In Progress", color: "bg-blue-100" },
  { key: "REPAIRED", label: "Repaired", color: "bg-green-100" },
  { key: "SCRAP", label: "Scrap", color: "bg-red-100" },
] as const;

export default function KanbanPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [draggedRequest, setDraggedRequest] =
    useState<MaintenanceRequest | null>(null);

  // Check if user has access to Kanban
  if (!canAccessKanban(user)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the Kanban board.
            </p>
            <Link
              href={user?.role === "EMPLOYEE" ? "/my-requests" : "/dashboard"}
              className="btn btn-primary"
            >
              Go to {user?.role === "EMPLOYEE" ? "My Requests" : "Dashboard"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data: kanbanData, isLoading } = useQuery<KanbanData>({
    queryKey: ["kanban"],
    queryFn: async () => {
      const response = await maintenanceRequestAPI.getKanban();
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      maintenanceRequestAPI.updateStage(id, { stage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban"] });
    },
  });

  const handleDragStart = (e: React.DragEvent, request: MaintenanceRequest) => {
    setDraggedRequest(request);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();

    if (draggedRequest && draggedRequest.stage !== targetStage) {
      // Optimistic update
      queryClient.setQueryData(["kanban"], (old: KanbanData | undefined) => {
        if (!old) return old;

        const newData = { ...old };
        // Remove from old stage
        newData[draggedRequest.stage as keyof KanbanData] = newData[
          draggedRequest.stage as keyof KanbanData
        ].filter((r) => r.id !== draggedRequest.id);

        // Add to new stage
        newData[targetStage as keyof KanbanData] = [
          ...newData[targetStage as keyof KanbanData],
          { ...draggedRequest, stage: targetStage as any },
        ];

        return newData;
      });

      // Update on server
      updateStageMutation.mutate({
        id: draggedRequest.id,
        stage: targetStage,
      });
    }

    setDraggedRequest(null);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading Kanban board...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Maintenance Requests - Kanban
          </h2>
          <p className="text-gray-600 mt-1">
            Drag and drop requests to update their status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGES.map((stage) => (
            <div
              key={stage.key}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.key)}
              className={`${stage.color} rounded-lg p-4 min-h-[500px]`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                  {kanbanData?.[stage.key]?.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {kanbanData?.[stage.key]?.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>

              {(!kanbanData?.[stage.key] ||
                kanbanData[stage.key].length === 0) && (
                <div className="text-center text-gray-400 mt-8">
                  No requests
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

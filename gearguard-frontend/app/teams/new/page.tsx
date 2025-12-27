"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { maintenanceTeamAPI, authAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { canManageTeams } from "@/lib/permissions";
import Link from "next/link";

export default function NewTeamPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Check if user has permission (only ADMIN can create teams)
  if (!canManageTeams(user)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              Only administrators can create maintenance teams.
            </p>
            <Link href="/teams" className="btn btn-primary">
              Back to Teams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const createMutation = useMutation({
    mutationFn: (data: any) => maintenanceTeamAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      router.push("/teams");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Maintenance Team
          </h1>
          <p className="text-gray-600 mt-1">Add a new maintenance team</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="label">Team Name *</label>
            <input
              type="text"
              required
              className="input"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Electrical Team, HVAC Team"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              rows={4}
              className="input"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the team's responsibilities"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After creating the team, you can assign
              team members and equipment through the team management interface.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary flex-1"
            >
              {createMutation.isPending ? "Creating..." : "Create Team"}
            </button>
            <Link href="/teams" className="btn btn-secondary">
              Cancel
            </Link>
          </div>

          {createMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              Failed to create team. Please try again.
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

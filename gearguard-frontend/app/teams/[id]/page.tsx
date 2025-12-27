"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { maintenanceTeamAPI, authAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { canManageTeams } from "@/lib/permissions";
import Link from "next/link";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const teamId = params.id as string;

  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState("");

  const { data: team, isLoading } = useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const response = await maintenanceTeamAPI.getOne(teamId);
      return response.data;
    },
    enabled: canManageTeams(user), // Only fetch if user has permission
  });

  // Get all users to add as members
  const { data: allUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await authAPI.getUsers();
      return response.data;
    },
    enabled: showAddMember && canManageTeams(user),
  });

  const addMemberMutation = useMutation({
    mutationFn: (userId: string) =>
      maintenanceTeamAPI.addMember(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setShowAddMember(false);
      setSelectedUserId("");
      setError("");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to add member");
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) =>
      maintenanceTeamAPI.removeMember(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setError("");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to remove member");
    },
  });

  const handleAddMember = () => {
    if (selectedUserId) {
      setError("");
      addMemberMutation.mutate(selectedUserId);
    }
  };

  const handleRemoveMember = (userId: string, memberName: string) => {
    if (confirm(`Remove ${memberName} from this team?`)) {
      setError("");
      removeMemberMutation.mutate(userId);
    }
  };

  // Check if user has permission AFTER all hooks
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
              Only administrators can manage teams.
            </p>
            <Link href="/teams" className="btn btn-primary">
              Back to Teams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading team...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/teams"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Teams
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{team?.name}</h1>
          {team?.description && (
            <p className="text-gray-600 mt-1">{team.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Team Members
                </h2>
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="btn btn-primary text-sm"
                >
                  + Add Member
                </button>
              </div>

              {showAddMember && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Add New Member
                  </h3>
                  {error && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                      {error}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <select
                      className="input flex-1"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                    >
                      <option value="">Select a user...</option>
                      {allUsers
                        ?.filter(
                          (u: any) =>
                            !team?.members?.some((m: any) => m.id === u.id)
                        )
                        .map((u: any) => (
                          <option key={u.id} value={u.id}>
                            {u.firstName} {u.lastName} ({u.role})
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={handleAddMember}
                      disabled={!selectedUserId || addMemberMutation.isPending}
                      className="btn btn-primary"
                    >
                      {addMemberMutation.isPending ? "Adding..." : "Add"}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddMember(false);
                        setSelectedUserId("");
                        setError("");
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {error && !showAddMember && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {team?.members?.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveMember(
                          member.id,
                          `${member.firstName} ${member.lastName}`
                        )
                      }
                      disabled={removeMemberMutation.isPending}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      {removeMemberMutation.isPending
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                ))}
              </div>

              {(!team?.members || team.members.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No members in this team yet. Add members to get started.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Members</span>
                  <span className="font-semibold text-gray-900">
                    {team?.members?.length || 0}
                  </span>
                </div>
                {team?._count && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Equipment</span>
                      <span className="font-semibold text-gray-900">
                        {team._count.equipment}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Requests</span>
                      <span className="font-semibold text-gray-900">
                        {team._count.maintenanceRequests}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { maintenanceTeamAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { canViewTeams, canManageTeams } from "@/lib/permissions";
import { MaintenanceTeam } from "@/lib/types";

export default function TeamsPage() {
  const { user } = useAuth();

  // Check if user has access
  if (!canViewTeams(user)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to view teams.
            </p>
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data: teams, isLoading } = useQuery<MaintenanceTeam[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await maintenanceTeamAPI.getAll();
      return response.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Maintenance Teams
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your maintenance teams and members
            </p>
          </div>
          {canManageTeams(user) && (
            <Link href="/teams/new" className="btn btn-primary">
              + Add Team
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading teams...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams?.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900 text-lg mb-4">
                  {team.name}
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Team Members
                    </p>
                    <div className="space-y-2">
                      {team.members?.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                            {member.firstName[0]}
                            {member.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      ))}
                      {team.members && team.members.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{team.members.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>

                  {team._count && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          {team._count.equipment}
                        </span>{" "}
                        equipment items
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          {team._count.maintenanceRequests}
                        </span>{" "}
                        maintenance requests
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {teams?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No teams found. Create your first maintenance team.
          </div>
        )}
      </main>
    </div>
  );
}

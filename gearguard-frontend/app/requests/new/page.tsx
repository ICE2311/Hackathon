"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  maintenanceRequestAPI,
  equipmentAPI,
  maintenanceTeamAPI,
} from "@/lib/api";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function NewRequestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    type: "CORRECTIVE" as "CORRECTIVE" | "PREVENTIVE",
    equipmentId: "",
    scheduledDate: "",
    scheduledTime: "",
  });

  const { data: equipment } = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const response = await equipmentAPI.getAll({ status: "ACTIVE" });
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => maintenanceRequestAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban"] });
      router.push("/kanban");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      subject: formData.subject,
      description: formData.description,
      type: formData.type,
      equipmentId: formData.equipmentId,
    };

    if (formData.type === "PREVENTIVE" && formData.scheduledDate) {
      // Combine date and time if time is provided
      const dateTimeString = formData.scheduledTime
        ? `${formData.scheduledDate}T${formData.scheduledTime}:00`
        : `${formData.scheduledDate}T09:00:00`;
      payload.scheduledDate = new Date(dateTimeString).toISOString();
    }

    createMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Maintenance Request
          </h1>
          <p className="text-gray-600 mt-1">Submit a new maintenance request</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="label">Subject *</label>
            <input
              type="text"
              required
              className="input"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea
              required
              rows={4}
              className="input"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detailed description of the maintenance required"
            />
          </div>

          <div>
            <label className="label">Request Type *</label>
            <select
              className="input"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as any })
              }
            >
              <option value="CORRECTIVE">Corrective (Breakdown/Repair)</option>
              <option value="PREVENTIVE">Preventive (Scheduled)</option>
            </select>
          </div>

          <div>
            <label className="label">Equipment *</label>
            <select
              required
              className="input"
              value={formData.equipmentId}
              onChange={(e) =>
                setFormData({ ...formData, equipmentId: e.target.value })
              }
            >
              <option value="">Select equipment...</option>
              {equipment?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.serialNumber} ({item.department})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Team and technician will be auto-assigned based on equipment
              defaults
            </p>
          </div>

          {formData.type === "PREVENTIVE" && (
            <>
              <div>
                <label className="label">Scheduled Date *</label>
                <input
                  type="date"
                  required
                  className="input"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label">Scheduled Time</label>
                <input
                  type="time"
                  className="input"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledTime: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Defaults to 9:00 AM if not specified
                </p>
              </div>
            </>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary flex-1"
            >
              {createMutation.isPending ? "Creating..." : "Create Request"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>

          {createMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              Failed to create request. Please try again.
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

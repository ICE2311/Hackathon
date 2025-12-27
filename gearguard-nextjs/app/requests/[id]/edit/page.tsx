"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { maintenanceRequestAPI, equipmentAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { canEditRequest } from "@/lib/permissions";
import { useAuth } from "@/contexts/AuthContext";

export default function EditRequestPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    type: "CORRECTIVE" as "CORRECTIVE" | "PREVENTIVE",
    equipmentId: "",
    scheduledDate: "",
    scheduledTime: "",
  });

  const { data: request, isLoading } = useQuery({
    queryKey: ["request", id],
    queryFn: async () => {
      const response = await maintenanceRequestAPI.getOne(id);
      return response.data;
    },
  });

  const { data: equipment } = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const response = await equipmentAPI.getAll({ status: "ACTIVE" });
      return response.data;
    },
  });

  useEffect(() => {
    if (request) {
      const scheduledDateTime = request.scheduledDate
        ? new Date(request.scheduledDate)
        : null;

      setFormData({
        subject: request.subject || "",
        description: request.description || "",
        type: request.type || "CORRECTIVE",
        equipmentId: request.equipmentId || "",
        scheduledDate: scheduledDateTime
          ? format(scheduledDateTime, "yyyy-MM-dd")
          : "",
        scheduledTime: scheduledDateTime
          ? format(scheduledDateTime, "HH:mm")
          : "",
      });
    }
  }, [request]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => maintenanceRequestAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban"] });
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      router.push(user?.role === "EMPLOYEE" ? "/my-requests" : "/kanban");
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
      const dateTimeString = formData.scheduledTime
        ? `${formData.scheduledDate}T${formData.scheduledTime}:00`
        : `${formData.scheduledDate}T09:00:00`;
      payload.scheduledDate = new Date(dateTimeString).toISOString();
    }

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading request...</div>
        </div>
      </div>
    );
  }

  // Check if user has permission to edit this request
  if (request && !canEditRequest(user, request)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to edit this request.
            </p>
            <Link
              href={user?.role === "EMPLOYEE" ? "/my-requests" : "/kanban"}
              className="btn btn-primary"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Request not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Maintenance Request
          </h1>
          <p className="text-gray-600 mt-1">Update request details</p>
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
              disabled={updateMutation.isPending}
              className="btn btn-primary flex-1"
            >
              {updateMutation.isPending ? "Updating..." : "Update Request"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>

          {updateMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              Failed to update request. Please try again.
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  maintenanceRequestAPI,
  equipmentAPI,
  maintenanceTeamAPI,
  authAPI,
} from "@/lib/api";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { canAccessSchedule } from "@/lib/permissions";
import Link from "next/link";
import { format, startOfMonth, endOfMonth, addDays, isSameDay } from "date-fns";

export default function SchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    technicianId: "",
    notes: "",
  });

  /* HOOKS MUST BE AT THE TOP LEVEL */
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  // Fetch Calendar Data (Already Scheduled)
  const { data: scheduledRequests } = useQuery({
    queryKey: ["schedule", dateRange],
    queryFn: async () => {
      const response = await maintenanceRequestAPI.getCalendar(
        dateRange.start,
        dateRange.end
      );
      return response.data;
    },
    enabled: canAccessSchedule(user),
  });

  // Fetch Unscheduled Requests (Backlog)
  const { data: backlogRequests } = useQuery({
    queryKey: ["backlog-requests"],
    queryFn: async () => {
      const response = await maintenanceRequestAPI.getAll({
        stage: "NEW",
        type: "CORRECTIVE",
      });
      return response.data.filter((r: any) => !r.scheduledDate);
    },
    enabled: canAccessSchedule(user),
  });

  // Fetch Technicians
  const { data: technicians } = useQuery({
    queryKey: ["technicians"],
    queryFn: async () => {
      const response = await authAPI.getUsers();
      return response.data.filter(
        (u: any) => u.role === "TECHNICIAN" || u.role === "MANAGER"
      );
    },
    enabled: canAccessSchedule(user),
  });

  const scheduleMutation = useMutation({
    mutationFn: (data: any) =>
      maintenanceRequestAPI.update(data.id, {
        scheduledDate: new Date(data.date).toISOString(),
      }),
    onSuccess: async (_, variables) => {
      if (variables.technicianId) {
        await maintenanceRequestAPI.assignTechnician(variables.id, {
          technicianId: variables.technicianId,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["backlog-requests"] });
      setIsModalOpen(false);
      setSelectedRequest(null);
    },
  });

  // Check if user has access (AFTER HOOKS)
  if (!canAccessSchedule(user)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the schedule.
            </p>
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenSchedule = (request: any, date?: Date) => {
    setSelectedRequest(request);
    setScheduleForm({
      date: date
        ? format(date, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      technicianId: request.assignedTechnician?.id || "",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    scheduleMutation.mutate({
      id: selectedRequest.id,
      date: scheduleForm.date,
      technicianId: scheduleForm.technicianId,
    });
  };

  const getRequestsForDate = (date: Date) => {
    return (
      scheduledRequests?.filter(
        (req: any) =>
          req.scheduledDate && isSameDay(new Date(req.scheduledDate), date)
      ) || []
    );
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const days = [];
    let currentDate = monthStart;

    while (currentDate <= monthEnd) {
      days.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-700 py-2"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const requests = getRequestsForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={index}
              className={`min-h-32 p-2 border rounded-lg hover:border-blue-400 transition-colors cursor-pointer group relative ${
                isToday
                  ? "bg-blue-50 border-blue-300"
                  : "bg-white border-gray-200"
              }`}
              onClick={() => {
                // Could allow creating new request on click
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {format(day, "d")}
                </span>
                {/* Plus icon visible on hover to add task directly? */}
              </div>

              <div className="space-y-1">
                {requests.map((req: any) => (
                  <div
                    key={req.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSchedule(req, day);
                    }}
                    className={`text-xs p-1.5 rounded border border-transparent hover:border-gray-300 cursor-pointer shadow-sm ${
                      req.priority === "HIGH"
                        ? "bg-red-50 text-red-800"
                        : req.priority === "MEDIUM"
                        ? "bg-yellow-50 text-yellow-800"
                        : "bg-green-50 text-green-800"
                    }`}
                  >
                    <div className="font-medium truncate">{req.subject}</div>
                    {req.assignedTechnician && (
                      <div className="text-[10px] opacity-75 truncate">
                        👤 {req.assignedTechnician.firstName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar: Unscheduled Corrective Repairs */}
        <aside className="w-full lg:w-1/4 min-w-[280px] flex flex-col gap-4 order-2 lg:order-1">
          <div className="card flex-1 overflow-hidden flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-4 px-1">
              Backlog / Unscheduled
            </h3>
            <p className="text-xs text-gray-500 mb-4 px-1">
              Corrective repairs needing schedule
            </p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {backlogRequests?.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No unscheduled items
                </div>
              )}
              {backlogRequests?.map((req: any) => (
                <div
                  key={req.id}
                  className="p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleOpenSchedule(req)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        req.priority === "HIGH"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {req.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      #{req.id.slice(0, 4)}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {req.subject}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2 truncate">
                    {req.description}
                  </p>
                  <button className="w-full text-xs py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium">
                    Schedule →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Calendar Area */}
        <main className="flex-1 flex flex-col gap-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {format(selectedDate, "MMMM yyyy")}
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedDate(addDays(selectedDate, -30))}
                  className="btn btn-secondary text-sm"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="btn btn-secondary text-sm"
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedDate(addDays(selectedDate, 30))}
                  className="btn btn-secondary text-sm"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[700px]">{renderCalendar()}</div>
            </div>
          </div>
        </main>
      </div>

      {/* Scheduling Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center catch-click z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl m-4">
            <h3 className="text-lg font-bold mb-4">Schedule Repair</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
              <p className="font-semibold">{selectedRequest.subject}</p>
              <p className="text-gray-600 truncate">
                {selectedRequest.description}
              </p>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  required
                  className="input"
                  value={scheduleForm.date}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label">Assign Technician</label>
                <select
                  className="input"
                  value={scheduleForm.technicianId}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      technicianId: e.target.value,
                    })
                  }
                >
                  <option value="">-- Unassigned --</option>
                  {technicians?.map((tech: any) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.firstName} {tech.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleMutation.isPending}
                  className="btn btn-primary"
                >
                  {scheduleMutation.isPending
                    ? "Saving..."
                    : "Confirm Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

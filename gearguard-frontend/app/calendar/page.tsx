"use client";

import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { maintenanceRequestAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function CalendarPage() {
  const calendarRef = useRef<any>(null);
  const [dateRange, setDateRange] = React.useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  const { data: calendarData } = useQuery({
    queryKey: ["calendar", dateRange],
    queryFn: async () => {
      const response = await maintenanceRequestAPI.getCalendar(
        dateRange.start,
        dateRange.end
      );
      return response.data;
    },
  });

  const events =
    calendarData?.map((request: any) => ({
      id: request.id,
      title: request.subject,
      start: request.scheduledDate,
      backgroundColor: request.isOverdue ? "#ef4444" : "#3b82f6",
      borderColor: request.isOverdue ? "#dc2626" : "#2563eb",
      extendedProps: {
        type: request.type,
        equipment: request.equipment?.name,
        stage: request.stage,
      },
    })) || [];

  const handleDatesSet = (arg: any) => {
    setDateRange({
      start: format(arg.start, "yyyy-MM-dd"),
      end: format(arg.end, "yyyy-MM-dd"),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Maintenance Calendar
          </h1>
          <p className="text-gray-600 mt-1">
            View scheduled preventive maintenance
          </p>
        </div>

        <div className="card">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            height="auto"
            datesSet={handleDatesSet}
            eventClick={(info) => {
              alert(
                `Request: ${info.event.title}\nEquipment: ${info.event.extendedProps.equipment}\nStage: ${info.event.extendedProps.stage}`
              );
            }}
          />
        </div>

        <div className="mt-6 card">
          <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-sm text-gray-700">Scheduled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-sm text-gray-700">Overdue</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

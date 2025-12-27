import React from "react";
import { MaintenanceRequest } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";

interface RequestCardProps {
  request: MaintenanceRequest;
  onDragStart: (e: React.DragEvent, request: MaintenanceRequest) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onDragStart }) => {
  const isOverdue =
    request.isOverdue &&
    request.stage !== "REPAIRED" &&
    request.stage !== "SCRAP";

  return (
    <Link href={`/requests/${request.id}/edit`}>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, request)}
        className={`card p-4 mb-3 cursor-move hover:shadow-lg transition-shadow ${
          isOverdue ? "border-2 border-red-500 bg-red-50" : ""
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-900">{request.subject}</h4>
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

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {request.description}
        </p>

        <div className="space-y-1 text-xs text-gray-500">
          <p>
            <span className="font-medium">Equipment:</span>{" "}
            {request.equipment?.name}
          </p>
          {request.assignedTechnician && (
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                {request.assignedTechnician.firstName[0]}
                {request.assignedTechnician.lastName[0]}
              </div>
              <span className="text-xs">
                {request.assignedTechnician.firstName}{" "}
                {request.assignedTechnician.lastName}
              </span>
            </div>
          )}
          {request.scheduledDate && (
            <p className={isOverdue ? "text-red-600 font-medium" : ""}>
              <span className="font-medium">Scheduled:</span>{" "}
              {format(new Date(request.scheduledDate), "MMM dd, yyyy")}
            </p>
          )}
        </div>

        {isOverdue && (
          <div className="mt-2 text-xs font-medium text-red-600">
            ⚠️ OVERDUE
          </div>
        )}
      </div>
    </Link>
  );
};

export default RequestCard;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { equipmentAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { canManageEquipment } from "@/lib/permissions";
import Link from "next/link";
import { EquipmentStatus } from "@/lib/types";

export default function NewEquipmentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    department: "Production",
    category: "Machinery",
    location: "",
    status: "ACTIVE" as EquipmentStatus,
    purchaseDate: new Date().toISOString().split("T")[0],
    warrantyExpiry: "",
    notes: "",
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => equipmentAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      router.push("/equipment");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to create equipment");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.serialNumber) {
      setError("Name and Serial Number are required");
      return;
    }

    createMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Permission check
  if (!canManageEquipment(user)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              Only managers and admins can add equipment.
            </p>
            <Link href="/equipment" className="btn btn-primary">
              Back to Equipment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/equipment"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Equipment
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Add New Equipment
          </h1>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <label className="label" htmlFor="name">
                  Equipment Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="serialNumber">
                  Serial Number *
                </label>
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="department">
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="Production">Production</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="IT">IT</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Warehouse">Warehouse</option>
                </select>
              </div>

              <div>
                <label className="label" htmlFor="category">
                  Category *
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  list="categories"
                />
                <datalist id="categories">
                  <option value="Machinery" />
                  <option value="Vehicle" />
                  <option value="IT Hardware" />
                  <option value="Tools" />
                  <option value="Safety Gear" />
                </datalist>
              </div>

              <div>
                <label className="label" htmlFor="location">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="label" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">In Maintenance</option>
                  <option value="BROKEN">Broken</option>
                  <option value="SCRAPPED">Scrapped</option>
                </select>
              </div>

              <div>
                <label className="label" htmlFor="purchaseDate">
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="label" htmlFor="warrantyExpiry">
                  Warranty Expiry
                </label>
                <input
                  type="date"
                  id="warrantyExpiry"
                  name="warrantyExpiry"
                  value={formData.warrantyExpiry}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input h-32"
                placeholder="Additional details..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <Link href="/equipment" className="btn btn-secondary mr-4">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn btn-primary"
              >
                {createMutation.isPending ? "Creating..." : "Create Equipment"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

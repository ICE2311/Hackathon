import { User, MaintenanceRequest } from "./types";

type UserRole = "ADMIN" | "MANAGER" | "TECHNICIAN" | "EMPLOYEE";

/**
 * Check if user has any of the specified roles
 */
export const hasRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

/**
 * Check if user can edit a specific request
 * - ADMIN can edit any request
 * - Others can only edit their own requests
 */
export const canEditRequest = (
  user: User | null,
  request: MaintenanceRequest
): boolean => {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return request.createdById === user.id;
};

/**
 * Check if user can access Kanban board
 * - EMPLOYEE cannot access
 * - Others can access
 */
export const canAccessKanban = (user: User | null): boolean => {
  return hasRole(user, ["ADMIN", "MANAGER", "TECHNICIAN"]);
};

/**
 * Check if user can manage Kanban (drag and drop)
 * - EMPLOYEE cannot manage
 * - Others can manage
 */
export const canManageKanban = (user: User | null): boolean => {
  return hasRole(user, ["ADMIN", "MANAGER", "TECHNICIAN"]);
};

/**
 * Check if user can access schedule/calendar
 */
export const canAccessSchedule = (user: User | null): boolean => {
  return hasRole(user, ["ADMIN", "MANAGER", "TECHNICIAN"]);
};

/**
 * Check if user can manage schedules
 */
export const canManageSchedule = (user: User | null): boolean => {
  return hasRole(user, ["ADMIN", "MANAGER", "TECHNICIAN"]);
};

/**
 * Check if user can view equipment
 */
export const canViewEquipment = (user: User | null): boolean => {
  return hasRole(user, ["ADMIN", "MANAGER", "TECHNICIAN"]);
};

/**
 * Check if user can manage equipment (create/edit/delete)
 */
export const canManageEquipment = (user: User | null): boolean => {
  return hasRole(user, ["ADMIN", "MANAGER"]);
};

/**
 * Check if user can view teams
 */
export const canViewTeams = (user: User | null): boolean => {
  return hasRole(user, ["ADMIN", "MANAGER", "TECHNICIAN"]);
};

/**
 * Check if user can manage teams (create/edit/delete)
 */
export const canManageTeams = (user: User | null): boolean => {
  return hasRole(user, ["ADMIN", "MANAGER"]);
};

/**
 * Check if user can access dashboard
 */
export const canAccessDashboard = (user: User | null): boolean => {
  return !!user; // All authenticated users can access dashboard
};

/**
 * Get user-friendly role name
 */
export const getRoleName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    ADMIN: "Administrator",
    MANAGER: "Manager",
    TECHNICIAN: "Technician",
    EMPLOYEE: "Employee",
  };
  return roleNames[role] || role;
};

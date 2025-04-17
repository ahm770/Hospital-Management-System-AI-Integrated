// src/services/shift/types.ts
export interface Shift {
    _id: string;
    staff: StaffInfo; //  StaffInfo
    department: DepartmentInfo; // DepartmentInfo
    date: string; // ISO Date String
    startTime: string; // e.g., "08:00 AM"
    endTime: string;   // e.g., "04:00 PM"
    type: "morning" | "evening" | "night";
    status: "scheduled" | "completed" | "cancelled";
    createdAt: string;
    updatedAt: string;
  }
  interface StaffInfo {
      _id: string;
      firstName: string;
      lastName: string;
  }
  interface DepartmentInfo {
      _id: string;
      name: string;
  }
  export interface ShiftCreateRequest {
    staff: string; // Staff ID
    department: string; // Department ID
    date: string; // ISO Date String
    startTime: string; // e.g., "08:00 AM"
    endTime: string;   // e.g., "04:00 PM"
    type: "morning" | "evening" | "night";
  }
  
  export interface ShiftUpdateRequest {
    date?: string;
    startTime?: string;
    endTime?: string;
    type?: "morning" | "evening" | "night";
    status?: "scheduled" | "completed" | "cancelled";
  }
  
  export interface GetShiftsParams {
    page?: number;
    limit?: number;
    search?: string;
    date?: string;
    staff?: string;
    department?: string;
  }
  
  export interface GetShiftsResponse {
    shifts: Shift[];
    totalShifts: number;
    currentPage: number;
    totalPages: number;
  }
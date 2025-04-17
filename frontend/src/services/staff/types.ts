// src/services/staff/types.ts
export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
  userType: "Staff";
  isActive: boolean;
  role: { _id: string; name: string };  
  department: { _id: string; name: string };  
  createdAt: string;
  updatedAt: string;
}
  
  export interface StaffCreateRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    gender: string;
    role: string;
    department: string;
  }
  
  export interface StaffUpdateRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dob?: string;
    address?: string;
    gender?: string;
    role?: string;
    department?: string;
    isActive?: boolean;
  }

export  interface GetStaffParams {  
    page?: number;
    limit?: number;
    search?: string;  
    department?: string;
}
export interface GetStaffResponse { 
  staff: Staff[], 
  totalStaff: number, 
  currentPage: number, 
  totalPages:number
}

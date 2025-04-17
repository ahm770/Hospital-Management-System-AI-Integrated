// src/services/patient/types.ts
export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;  
  address: string;
  gender: string;
  userType: "Patient";
  role: { _id: string; name: string };  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
}

export interface PatientUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  gender?: string;
}

export interface GetPatientsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetPatientsResponse {
   patients: Patient[], 
   totalPatients: number, 
   currentPage: number, 
   totalPages:number 
  }

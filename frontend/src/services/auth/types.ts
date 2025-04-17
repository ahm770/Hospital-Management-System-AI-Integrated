export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;  // Date of Birth, assuming string representation
  address: string;
  gender: string;
  userType: "Patient"; // ENUM
  isActive: boolean;
  role?: { _id: string; name: string }; 
  medicalRecords: any[];  // Or define a type for medical records if known
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;  // Date of Birth, assuming string representation
  address: string;
  gender: string;
  userType: "Staff"; // ENUM
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role?: {_id:string, name:string}; // Optional  
  department?: {_id:string, name:string}; // Optional - only for Staff
}

export type User = Patient | Staff

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface UserResponse {
  message: string;
  token: string;
  user: User; // Includes the full user object now
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
  userType: string;
  role?: string;
  department?: string;
}

export interface RegisterResponse {
  message: string;
  user: User; // Include the newly registered user
}

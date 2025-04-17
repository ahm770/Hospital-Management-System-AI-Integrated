// src/services/appointment/appointmentSliceAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/constants";

export interface Appointment {
  _id: string;
  patient: PatientInfo; // Replace with appropriate type
  doctor: StaffInfo;  // Replace with appropriate type
  department: DepartmentInfo; // Replace with appropriate type
  date: string;  // ISO Date String
  status: "pending" | "confirmed" | "rescheduled" | "canceled";
  assignedTo?: StaffInfo | null;
  confirmedBy?: StaffInfo | null;
  createdBy: StaffInfo;
  createdAt: string;
  updatedAt: string;
}

interface PatientInfo {
    _id: string;
    firstName: string;
    lastName: string;
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

interface AppointmentCreateRequest {
    patient: string;
    doctor: string;
    department: string;
    date: string;
    time?:string;
    status?:string;
    assignedTo?: string;
    confirmedBy?: string;
}

interface AppointmentUpdateRequest {
    patient?: string;
    doctor?: string;
    department?: string;
    date?: string;
    status?: "pending" | "confirmed" | "rescheduled" | "canceled";
}

interface GetAppointmentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetAppointmentsResponse {
  appointments: Appointment[];
  totalAppointments: number;
  currentPage: number;
  totalPages: number;
}

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    getAppointments: builder.query<GetAppointmentsResponse, GetAppointmentsParams>({
        query: (params) => {  // Take the whole params object
            const { page , limit , search } = params || {};  // Safely destructure
            let url = `appointments?page=${page}&limit=${limit}`;
            if (search) {
              url += `&search=${search}`;
            }
            return url;
          },
       providesTags: (result) =>
         result?.appointments
            ? [
                ...result.appointments.map(({ _id }) => ({ type: 'Appointment' as const, id: _id })),
                { type: 'Appointment', id: 'LIST' },
              ]
            : [{ type: 'Appointment', id: 'LIST' }],
    }),
    createAppointment: builder.mutation<Appointment, AppointmentCreateRequest>({
      query: (appointmentData) => ({
        url: "appointments",
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    updateAppointment: builder.mutation<Appointment, { id: string; data: AppointmentUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `appointments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Appointment', id: arg.id }],
    }),
    deleteAppointment: builder.mutation<void, string>({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Appointment', id: arg }],
    }),
    getAppointmentById: builder.query<Appointment, string>({
      query: (id) => `appointments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Appointment', id }],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentByIdQuery,
} = appointmentApi;
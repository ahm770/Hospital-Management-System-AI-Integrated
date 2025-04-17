// src/services/shift/shiftSliceAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/constants";

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

interface ShiftUpdateRequest {
  date?: string;
  startTime?: string;
  endTime?: string;
  type?: "morning" | "evening" | "night";
  status?: "scheduled" | "completed" | "cancelled";
}

interface GetShiftsParams {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  staff?: string;
  department?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface GetShiftsResponse {
  shifts: Shift[];
  totalShifts: number;
  currentPage: number;
  totalPages: number;
}

export const shiftApi = createApi({
  reducerPath: "shiftApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ['Shift'],
  endpoints: (builder) => ({
    getShifts: builder.query<GetShiftsResponse, GetShiftsParams>({
      query: (params) => {
        const { page, limit, search, date, staff, department, sortBy, sortOrder } = params || {};
        let url = `shifts?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (date) url += `&date=${date}`;
        if (staff) url += `&staff=${staff}`;
        if (department) url += `&department=${department}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
        if (sortOrder) url += `&sortOrder=${sortOrder}`;
        return url;
      },
      providesTags: (result) =>
        result?.shifts
          ? [
            ...result.shifts.map(({ _id }) => ({ type: 'Shift' as const, id: _id })),
            { type: 'Shift', id: 'LIST' },
          ]
          : [{ type: 'Shift', id: 'LIST' }],
    }),
          getMyShifts: builder.query<GetShiftsResponse, GetShiftsParams>({
            query: (params) => {
                const { page, limit, search, date, sortBy, sortOrder } = params || {};
                let url = `shifts/mine?page=${page}&limit=${limit}`;
                if (search) url += `&search=${search}`;
                if (date) url += `&date=${date}`;
                if (sortBy) url += `&sortBy=${sortBy}`;
                if (sortOrder) url += `&sortOrder=${sortOrder}`;
                return url;
            },
            providesTags: (result) =>
                result?.shifts
                    ? [
                        ...result.shifts.map(({ _id }) => ({ type: 'Shift' as const, id: _id })),
                        { type: 'Shift', id: 'LIST' },
                    ]
                    : [{ type: 'Shift', id: 'LIST' }],
        }),
    createShift: builder.mutation<Shift, ShiftCreateRequest>({
      query: (shiftData) => ({
        url: "shifts",
        method: "POST",
        body: shiftData,
      }),
      invalidatesTags: [{ type: 'Shift', id: 'LIST' }],
    }),
    updateShift: builder.mutation<Shift, { id: string; data: ShiftUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `shifts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Shift', id: arg.id }],
    }),
    deleteShift: builder.mutation<void, string>({
      query: (id) => ({
        url: `shifts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Shift', id: arg }],
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useGetMyShiftsQuery, 
} = shiftApi;
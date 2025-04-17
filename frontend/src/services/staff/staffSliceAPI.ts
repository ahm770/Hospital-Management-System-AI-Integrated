// src/services/staff/staffSliceAPI.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Staff, StaffCreateRequest, StaffUpdateRequest, GetStaffResponse, GetStaffParams } from "./types"; // Import your Staff types
import { BASE_URL } from "@/constants/constants"; // Adjust path as needed

export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token; // Adjust path as needed
      console.log("token-staffapi::", token)
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ['Staff'], // Define a tag type for invalidation
  endpoints: (builder) => ({
    getStaff: builder.query<GetStaffResponse, GetStaffParams>({  // Modified return type
      query: (params) => {  // Take the whole params object
        const { page, limit, search, department } = params || {};  // Safely destructure
        let url = `staff?page=${page}&limit=${limit}`;
        if (search) {
            url += `&search=${search}`;
        }
        if (department) {
          url += `&department=${department}`;
      }
        return url;
    },
      providesTags: (result) =>
        result?.staff // Check if result and result.staff exist before accessing
          ? [
              ...result.staff.map(({ _id }) => ({ type: 'Staff' as const, id: _id })),
              { type: 'Staff', id: 'LIST' },
            ]
          : [{ type: 'Staff', id: 'LIST' }],
    }),
    createStaff: builder.mutation<Staff, StaffCreateRequest>({
      query: (staffData) => ({
        url: "staff",
        method: "POST",
        body: staffData,
      }),
      invalidatesTags: [{ type: 'Staff', id: 'LIST' }],
    }),
    updateStaff: builder.mutation<Staff, { id: string; data: StaffUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `staff/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Staff', id: arg.id }],
    }),
    deleteStaff: builder.mutation<void, string>({
      query: (id) => ({
        url: `staff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Staff', id: arg }],
    }),
    getStaffById: builder.query<Staff, string>({
      query: (id) => `staff/${id}`,
      providesTags: (result, error, id) => [{ type: 'Staff', id }],
    }),

  }),
});

export const {
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useGetStaffByIdQuery,
} = staffApi;


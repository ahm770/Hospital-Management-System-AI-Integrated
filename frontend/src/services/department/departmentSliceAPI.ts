// src/services/department/departmentSliceAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/constants";

export interface Department {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentCreateRequest {
  name: string;
  description: string;
}

export interface DepartmentUpdateRequest {
  name?: string;
  description?: string;
}

interface GetDepartmentsParams {
  page?: number;  // Make page optional
  limit?: number;  // Make limit optional
  search?: string;
}

interface GetDepartmentsResponse {
   departments: Department[], 
   totalDepartments: number, 
   currentPage: number, 
   totalPages:number 
  }

export const departmentApi = createApi({
  reducerPath: "departmentApi",
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
  tagTypes: ['Department'],
  endpoints: (builder) => ({
    getDepartments: builder.query<GetDepartmentsResponse, GetDepartmentsParams>({
      query: (params) => {  // Take the whole params object
        const { page , limit , search } = params || {};  // Safely destructure
        let url = `departments?page=${page}&limit=${limit}`;
        if (search) {
          url += `&search=${search}`;
        }
        return url;
      },
      providesTags: (result) =>
        result?.departments
          ? [
            ...result.departments.map(({ _id }) => ({ type: 'Department' as const, id: _id })),
            { type: 'Department', id: 'LIST' },
          ]
          : [{ type: 'Department', id: 'LIST' }],
    }),
    createDepartment: builder.mutation<Department, DepartmentCreateRequest>({
      query: (departmentData) => ({
        url: "departments",
        method: "POST",
        body: departmentData,
      }),
      invalidatesTags: [{ type: 'Department', id: 'LIST' }],
    }),
    updateDepartment: builder.mutation<Department, { id: string; data: DepartmentUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `departments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Department', id: arg.id }],
    }),
    deleteDepartment: builder.mutation<void, string>({
      query: (id) => ({
        url: `departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Department', id: arg }],
    }),
    getDepartmentById: builder.query<Department, string>({
      query: (id) => `departments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Department', id }],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentByIdQuery,
} = departmentApi;
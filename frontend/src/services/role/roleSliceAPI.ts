// src/services/role/roleSliceAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/constants"; // Adjust path as needed
import {   Permission } from '@/services/permission/permissionSliceAPI';

export interface Role {
    _id: string;
    name: string;
    permissions: Permission[];   
}

interface RoleCreateRequest {
    name: string;
    permissions: string[]; // Array of permission IDs
}

interface RoleUpdateRequest {
    name?: string;
    permissions?: string[]; // Array of permission IDs
}

interface GetRolesParams {
    page?: number;  // Make page optional
    limit?: number;  // Make limit optional
    search?: string;
}

interface GetRolesResponse { 
    roles: Role[], 
    totalRoles: number, 
    currentPage: number, 
    totalPages:number }

export const roleApi = createApi({
    reducerPath: "roleApi",
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
    tagTypes: ['Role', 'Permission'], // Add tag types
    endpoints: (builder) => ({
        getRoles: builder.query<GetRolesResponse, GetRolesParams>({
            query: (params) => {  // Take the whole params object
                const { page , limit , search } = params || {};  // Safely destructure
                let url = `roles?page=${page}&limit=${limit}`;
                if (search) {
                    url += `&search=${search}`;
                }
                return url;
            },
             providesTags: (result) =>
              result?.roles
               ? [
                 ...result.roles.map(({ _id }) => ({ type: 'Role' as const, id: _id })),
                  { type: 'Role', id: 'LIST' },
                  ]
               : [{ type: 'Role', id: 'LIST' }],
        }),
        
        createRole: builder.mutation<Role, RoleCreateRequest>({
            query: (roleData) => ({
                url: "roles",
                method: "POST",
                body: roleData,
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),
        updateRole: builder.mutation<Role, { id: string; data: RoleUpdateRequest }>({
            query: ({ id, data }) => ({
                url: `roles/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Role', id: arg.id }],
        }),
        deleteRole: builder.mutation<void, string>({
            query: (id) => ({
                url: `roles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Role', id: arg }],
        }),
        getRoleById: builder.query<Role, string>({   
            query: (id) => `roles/${id}`,
            providesTags: (result, error, id) => [{ type: 'Role', id }],
        }),
    }),
});

export const {
    useGetRolesQuery,   
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
  useGetRoleByIdQuery,
} = roleApi;
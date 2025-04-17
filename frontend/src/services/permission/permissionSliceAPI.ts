// src/services/role/permissionSliceAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/constants";

export interface Permission {
    _id: string;
    action: string;
    description: string;
}

interface PermissionCreateRequest {
    action: string;
    description: string;
}

interface PermissionUpdateRequest {
    action?: string;
    description?: string;
}

interface GetPermissionsParams {
    page?: number;
    limit?: number;
    search?: string;
}
interface GetPermissionsResponse { permissions: Permission[], total: number, currentPage: number, limit:number }


export const permissionApi = createApi({
    reducerPath: "permissionApi",
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
    tagTypes: ['Permission'],
    endpoints: (builder) => ({
        getPermissions: builder.query<GetPermissionsResponse, GetPermissionsParams>({
            query: (params) => {  // Take the whole params object
                const { page, limit , search } = params || {};  // Safely destructure
                let url = `permissions?page=${page}&limit=${limit}`;
                if (search) {
                    url += `&search=${search}`;
                }
                return url;
            },
            providesTags: (result) =>
                result?.permissions
                    ? [
                        ...result.permissions.map(({ _id }) => ({ type: 'Permission' as const, id: _id })),
                        { type: 'Permission', id: 'LIST' },
                    ]
                    : [{ type: 'Permission', id: 'LIST' }],
        }),
        createPermission: builder.mutation<Permission, PermissionCreateRequest>({
            query: (permissionData) => ({
                url: "permissions",
                method: "POST",
                body: permissionData,
            }),
            invalidatesTags: [{ type: 'Permission', id: 'LIST' }],
        }),
        updatePermission: builder.mutation<Permission, { id: string; data: PermissionUpdateRequest }>({
            query: ({ id, data }) => ({
                url: `permissions/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Permission', id: arg.id }],
        }),
        deletePermission: builder.mutation<void, string>({
            query: (id) => ({
                url: `permissions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Permission', id: arg }],
        }),
        getPermissionById: builder.query<Permission, string>({
            query: (id) => `permissions/${id}`,
            providesTags: (result, error, id) => [{ type: 'Permission', id }],
        }),
    }),
});

export const {
    useGetPermissionsQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
    useDeletePermissionMutation,
    useGetPermissionByIdQuery,
} = permissionApi;
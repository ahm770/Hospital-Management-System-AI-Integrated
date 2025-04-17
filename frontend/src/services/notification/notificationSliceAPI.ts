// src/services/notification/notificationSliceAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/constants";

// Define the Notification interface (match your backend model)
export interface Notification {
    _id: string;
    user: string;  
    message: string;
    type: "appointment" | "medical_record" | "reminder" | "system" | "shift";
    priority: "urgent" | "warning" | "info";
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

interface GetNotificationsParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;  
    priority?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    read?: boolean
}

interface GetNotificationsResponse {
    success: boolean;
    notifications: Notification[];
    totalNotifications: number;
    currentPage: number;
    totalPages: number;
}

interface MarkNotificationAsReadResponse {
    message: string;
    notification: Notification;
}

interface MarkAllNotificationsAsReadResponse {
    message: string;
}

export const notificationApi = createApi({
    reducerPath: "notificationApi",
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
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getMyNotifications: builder.query<GetNotificationsResponse, GetNotificationsParams>({
            query: (params) => {
                const { page, limit, search, type, priority, sortBy, sortOrder, read } = params || {};
                let url = `notifications?page=${page}&limit=${limit}`;
                if (search) url += `&search=${search}`;
                if (type) url += `&type=${type}`;
                if (priority) url += `&priority=${priority}`;
                if (sortBy) url += `&sortBy=${sortBy}`;
                if (sortOrder) url += `&sortOrder=${sortOrder}`;
                if (read !== undefined) url += `&read=${read} ` 
                return url;
            },
            providesTags: (result) =>
                result?.notifications
                    ? [
                        ...result.notifications.map(({ _id }) => ({ type: 'Notification' as const, id: _id })),
                        { type: 'Notification', id: 'LIST' },
                    ]
                    : [{ type: 'Notification', id: 'LIST' }],
        }),

        markMyNotificationAsRead: builder.mutation<MarkNotificationAsReadResponse, string>({
            query: (id) => ({
                url: `notifications/${id}/read`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Notification', id: arg }],
        }),

        markAllMyNotificationsAsRead: builder.mutation<MarkAllNotificationsAsReadResponse, void>({
            query: () => ({
                url: `notifications/read/all`,
                method: 'PUT',
            }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetMyNotificationsQuery,
    useMarkMyNotificationAsReadMutation,
    useMarkAllMyNotificationsAsReadMutation,
} = notificationApi;
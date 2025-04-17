// src/services/task/taskSliceAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/constants";

// Define the Task interface
export interface Task {
    _id: string;
    title: string;
    description: string;
    assignedTo: {
        _id: string;
        firstName?:string;
        lastName?: string;
    }
    type: "appointment" | "lab_test" | "medical_record" | "discharge" | "prescription";
    status: "pending" | "in_progress" | "completed";
    priority: "low" | "medium" | "high";
    createdAt: string;
    createdBy: {
        _id: string;
        firstName?:string;
        lastName?: string;
    }
}

// Define the request and response types
export interface TaskCreateRequest {
    title: string;
    assignedTo?: string;
    type: "appointment" | "lab_test" | "medical_record" | "discharge" | "prescription";
    priority: "low" | "medium" | "high";
}

interface TaskUpdateRequest {
    title?: string;
    description?: string;
    assignedTo?: string;
    status?: "pending" | "in_progress" | "completed";
    priority?: "low" | "medium" | "high";
}

interface GetTasksParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: "pending" | "in_progress" | "completed";
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface GetTasksResponse {
    success: boolean;
    tasks: Task[];
    totalTasks: number;
    currentPage: number;
    totalPages: number;
}

interface CompleteTaskResponse {
    success: boolean;
    message: string;
    task: Task;
}

interface GetMyTasksParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: "pending" | "in_progress" | "completed";
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const taskApi = createApi({
    reducerPath: "taskApi",
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
    tagTypes: ['Task'],
    endpoints: (builder) => ({
        getTasks: builder.query<GetTasksResponse, GetTasksParams>({
            query: (params) => {
                const { page, limit, search, status, sortBy, sortOrder } = params || {};
                let url = `tasks?page=${page}&limit=${limit}`;
                if (search) url += `&search=${search}`;
                if (status) url += `&status=${status}`;
                if (sortBy) url += `&sortBy=${sortBy}`;
                if (sortOrder) url += `&sortOrder=${sortOrder}`;
                return url;
            },
            providesTags: (result) =>
                result?.tasks
                    ? [
                        ...result.tasks.map(({ _id }) => ({ type: 'Task' as const, id: _id })),
                        { type: 'Task', id: 'LIST' },
                    ]
                    : [{ type: 'Task', id: 'LIST' }],
        }),
        createTask: builder.mutation<Task, TaskCreateRequest>({
            query: (taskData) => ({
                url: "tasks",
                method: "POST",
                body: taskData,
            }),
            invalidatesTags: [{ type: 'Task', id: 'LIST' }],
        }),
        updateTask: builder.mutation<Task, { id: string; data: TaskUpdateRequest }>({
            query: ({ id, data }) => ({
                url: `tasks/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Task', id: arg.id }],
        }),
        deleteTask: builder.mutation<void, string>({
            query: (id) => ({
                url: `tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Task', id: arg }],
        }),
        getTaskById: builder.query<Task, string>({
            query: (id) => `tasks/${id}`,
            providesTags: (result, error, id) => [{ type: 'Task', id }],
        }),

        completeTask: builder.mutation<CompleteTaskResponse, string>({
            query: (id) => ({
                url: `tasks/${id}/complete`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Task', id: arg }],
        }),

         getMyTasks: builder.query<GetTasksResponse, GetMyTasksParams>({
            query: (params) => {
                const { page, limit, search, status, sortBy, sortOrder } = params || {};
                let url = `tasks/my?page=${page}&limit=${limit}`;
                if (search) url += `&search=${search}`;
                if (status) url += `&status=${status}`;
                if (sortBy) url += `&sortBy=${sortBy}`;
                if (sortOrder) url += `&sortOrder=${sortOrder}`;
                return url;
            },
            providesTags: (result) =>
                result?.tasks
                    ? [
                        ...result.tasks.map(({ _id }) => ({ type: 'Task' as const, id: _id })),
                        { type: 'Task', id: 'LIST' },
                    ]
                    : [{ type: 'Task', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useGetTaskByIdQuery,
    useCompleteTaskMutation,
    useGetMyTasksQuery,
} = taskApi;
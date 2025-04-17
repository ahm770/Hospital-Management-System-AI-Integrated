// src/services/auth/authSliceAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  UserResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  User
} from "./types";
import { BASE_URL } from "@/constants/constants";

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      console.log("token-authapi::", token)
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (info) => ({
        url: "auth/register",
        method: "POST",
        body: info,
      }),
    }),
        getProfile: builder.query<User, void>({   
            query: () => ({
                url: 'auth/profile',
                method: 'GET',
            }),
        }),
        resetPassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
          query: (body) => ({
              url: 'auth/reset-password',
              method: 'POST',
              body,
          }),
        }),
    logout: builder.mutation<void, void>({
        query: () => ({
            url: 'auth/logout', // Backend route URL for logout
            method: 'POST', // or DELETE, depending on your API
            // You might not need a body, but if you do:
            // body: {},
        }),
    }),
        
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useResetPasswordMutation
} = authApi;
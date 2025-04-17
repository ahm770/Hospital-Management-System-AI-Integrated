// src/services/patient/patientSliceAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/constants";
import type { Patient, PatientCreateRequest, PatientUpdateRequest, GetPatientsResponse, GetPatientsParams } from "./types";

export const patientApi = createApi({
    reducerPath: "patientApi",  
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth.token; // Adjust path as needed
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
        credentials: "include",
    }),
    tagTypes: ['Patient'],
    endpoints: (builder) => ({
        getPatients: builder.query<GetPatientsResponse, GetPatientsParams>({
            query: (params) => {  // Take the whole params object
                const { page , limit , search } = params || {};  // Safely destructure
                let url = `patients?page=${page}&limit=${limit}`;
                if (search) {
                    url += `&search=${search}`;
                }
                return url;
            },
            providesTags: (result) => { // Add type annotation here
              console.log("RES::", result)
              return result?.patients
                 ? [
                   ...result.patients.map(({ _id }) => ({ type: 'Patient' as const, id: _id })),
                   { type: 'Patient', id: 'LIST' },
                  ]
                : [{ type: 'Patient', id: 'LIST' }];
            },
        }),
        createPatient: builder.mutation<Patient, PatientCreateRequest>({
            query: (patientData) => ({
                url: "patients",
                method: "POST",
                body: patientData,
            }),
            invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
        }),
        updatePatient: builder.mutation<Patient, { id: string; data: PatientUpdateRequest }>({
            query: ({ id, data }) => ({
                url: `patients/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Patient', id: arg.id }],
        }),
        deletePatient: builder.mutation<void, string>({
            query: (id) => ({
                url: `patients/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Patient', id: arg }],
        }),
        getPatientById: builder.query<Patient, string>({
            query: (id) => `patients/${id}`,
            providesTags: (result, error, id) => [{ type: 'Patient', id }],
        }),
    }),
});

export const {
    useGetPatientsQuery,
    useCreatePatientMutation,
    useUpdatePatientMutation,
    useDeletePatientMutation,
    useGetPatientByIdQuery,
} = patientApi;


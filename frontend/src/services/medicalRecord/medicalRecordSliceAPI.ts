// src/services/medicalRecord/medicalRecordSliceAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/constants";

export interface MedicalRecord {
  _id: string;
  patient: PatientInfo;
  doctor: StaffInfo;
  diagnosis: string;
  treatment: string;
  medications: string[];
  symptoms: string[];
  notes: string;
  visitDate: string; //ISO Date String
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

export interface MedicalRecordCreateRequest {
  patient: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  symptoms?: string[];
  notes: string;
  visitDate: string; //ISO Date String
}

interface MedicalRecordUpdateRequest {
  patient?: string;
  doctor?: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  symptoms?: string[];
  notes?: string;
  visitDate?: string; //ISO Date String
}

interface GetMedicalRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetMedicalRecordsResponse {
  records: MedicalRecord[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
}

interface MedicalSummaryResponse {
  summary: string;
}

export const medicalRecordApi = createApi({
  reducerPath: "medicalRecordApi",
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
  tagTypes: ['MedicalRecord'],
  endpoints: (builder) => ({
    getMedicalRecords: builder.query<GetMedicalRecordsResponse, GetMedicalRecordsParams>({
        query: (params) => {  // Take the whole params object
            const { page , limit , search } = params || {};  // Safely destructure
            let url = `medical-records?page=${page}&limit=${limit}`;
            if (search) {
              url += `&search=${search}`;
            }
            return url;
          },
         providesTags: (result) =>
            result?.records
              ? [
                ...result.records.map(({ _id }) => ({ type: 'MedicalRecord' as const, id: _id })),
                { type: 'MedicalRecord', id: 'LIST' },
                 ]
               : [{ type: 'MedicalRecord', id: 'LIST' }],
    }),
    createMedicalRecord: builder.mutation<MedicalRecord, MedicalRecordCreateRequest>({
      query: (recordData) => ({
        url: "medical-records",
        method: "POST",
        body: recordData,
      }),
      invalidatesTags: [{ type: 'MedicalRecord', id: 'LIST' }],
    }),
    updateMedicalRecord: builder.mutation<MedicalRecord, { id: string; data: MedicalRecordUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `medical-records/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'MedicalRecord', id: arg.id }],
    }),
    deleteMedicalRecord: builder.mutation<void, string>({
      query: (id) => ({
        url: `medical-records/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'MedicalRecord', id: arg }],
    }),
    getMedicalRecordById: builder.query<MedicalRecord, string>({
      query: (id) => `medical-records/${id}`,
      providesTags: (result, error, id) => [{ type: 'MedicalRecord', id }],
    }),
    getMedicalSummary: builder.query<MedicalSummaryResponse, string>({
      query: (patientId) => `medical-records/${patientId}/summary`,
  }),
  }),
});

export const {
  useGetMedicalRecordsQuery,
  useCreateMedicalRecordMutation,
  useUpdateMedicalRecordMutation,
  useDeleteMedicalRecordMutation,
  useGetMedicalRecordByIdQuery,
  useGetMedicalSummaryQuery
} = medicalRecordApi;
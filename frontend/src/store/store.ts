// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/services/auth/authSliceAPI";
import authReducer from "@/services/auth/authSlice";
import { staffApi } from "@/services/staff/staffSliceAPI";
import { roleApi } from "@/services/role/roleSliceAPI";
import { departmentApi } from "@/services/department/departmentSliceAPI";
import { patientApi } from "@/services/patient/patientSliceAPI";
import { permissionApi } from "@/services/permission/permissionSliceAPI";
import { appointmentApi } from "@/services/appointment/appointmentSliceAPI"; 
import { medicalRecordApi } from "@/services/medicalRecord/medicalRecordSliceAPI"; 
import { shiftApi } from "@/services/shift/shiftSliceAPI"; 
import { taskApi } from "@/services/task/taskSliceAPI";
import { notificationApi } from "@/services/notification/notificationSliceAPI"; 
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistAuthConfig = {
    key: 'auth',
    storage,
};

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [staffApi.reducerPath]: staffApi.reducer,
        [roleApi.reducerPath]: roleApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [patientApi.reducerPath]: patientApi.reducer,
        [permissionApi.reducerPath]: permissionApi.reducer,
        [appointmentApi.reducerPath]: appointmentApi.reducer,  
        [medicalRecordApi.reducerPath]: medicalRecordApi.reducer,
        [shiftApi.reducerPath]: shiftApi.reducer,   
        [taskApi.reducerPath]: taskApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            authApi.middleware,
            staffApi.middleware,
            roleApi.middleware,
            departmentApi.middleware,
            patientApi.middleware,
            permissionApi.middleware,
            appointmentApi.middleware,    
            medicalRecordApi.middleware,
            shiftApi.middleware,
            taskApi.middleware,
            notificationApi.middleware,      
        );
    },
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
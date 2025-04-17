import { createSlice } from "@reduxjs/toolkit";
import type { AuthState, User } from "./types";
import { authApi } from "./authSliceAPI"; // Updated import path

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
       state.user = null;
       state.token = null;
   },
},
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        console.log("payload:", payload)
        state.token = payload.token;
        state.user = payload.user;
      }
    );
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, { payload }) => {
      }
    );
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled, 
      (state, { payload }) => {
			state.token = null;
			state.user = null;
			return state;
		});
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
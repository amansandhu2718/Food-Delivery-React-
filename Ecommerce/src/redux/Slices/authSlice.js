import { createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  accessToken: null,
};
const authslice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      console.log("Aman logout clicked");
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});
export const { loginSuccess, logout } = authslice.actions;

export default authslice.reducer;
export const restoreAuthFromToken = (token) => async (dispatch) => {
  try {
    // Optionally, fetch user info from API using the token
    const response = await api.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(loginSuccess({ user: response.data, accessToken: token }));
  } catch (error) {
    dispatch(logout());
  }
};

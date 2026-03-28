import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: null,
  lat: null,
  long: null,
  label: null,
  loading: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload.location;
      state.lat = action.payload.lat;
      state.long = action.payload.long;
      state.label = action.payload.label;
    },
    clearLocation: (state) => {
      state.location = null;
      state.lat = null;
      state.long = null;
      state.label = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLocation, clearLocation, setLoading } = locationSlice.actions;
export default locationSlice.reducer;

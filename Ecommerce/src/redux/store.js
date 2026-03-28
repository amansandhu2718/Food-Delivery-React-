import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import themeReducer from "./Slices/themeSlice";

import locationReducer from "./slices/locationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    location: locationReducer,
  },
});
export default store;

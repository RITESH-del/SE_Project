import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slices/authSlice.js";
import adminReducer from "../features/admin/slices/adminSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
    }
})
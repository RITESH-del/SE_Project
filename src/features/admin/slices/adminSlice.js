
import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboard } from "../thunks/adminThunks.js";

const adminSlice = createSlice({
    name : "admin",
    initialState : {
        loading : false,
        error : null,
        dashboard : [],
        timetable : null,
        courses : null,
        faculty : null,
        students : null,
        rooms : null,
        settings : null,
    },
    reducers : {
        
    },
    extraReducers : (builder)=>{
        builder
            .addCase(fetchDashboard.pending, (state)=>{
                state.loading = true;
            })
            .addCase(fetchDashboard.fulfilled, (state, action)=>{
                state.loading = false;
                state.dashboard = action.payload.components;
            })
            .addCase(fetchDashboard.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default adminSlice.reducer;
export const { } = adminSlice.actions;
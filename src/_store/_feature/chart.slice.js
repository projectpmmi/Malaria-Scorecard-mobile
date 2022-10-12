import { createSlice } from "@reduxjs/toolkit";

export const chartSlice = createSlice({
  name: "chart",
  initialState: {
    orgunitData: null,
    periodData: null,
  },
  reducers: {
    setOrgunitData: (state, action) => {
      state.orgunitData = action.payload;
    },
    deleteOrgunitData: (state, { payload }) => {
      state.orgunitData = null;
    },
    setPeriodData: (state, action) => {
      state.periodData = action.payload;
    },
    deletePeriodData: (state, { payload }) => {
      state.periodData = null;
    },
  },
});

export const {
  setOrgunitData,
  setPeriodData,
  deleteOrgunitData,
  deletePeriodData,
} = chartSlice.actions;
export default chartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const dataStoreSlice = createSlice({
  name: "dataStore",
  initialState: {
    dataStore: null,
  },
  reducers: {
    setDataStore: (state, action) => {
      state.dataStore = action.payload;
    },
    deleteDataStore: (state, { payload }) => {
      state.dataStore = [];
    },
  },
});

export const { setDataStore, deleteDataStore } = dataStoreSlice.actions;
export default dataStoreSlice.reducer;

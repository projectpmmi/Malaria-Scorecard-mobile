import { createSlice } from "@reduxjs/toolkit";

export const orgunitSlice = createSlice({
  name: "orgunit",
  initialState: {
    orgunit: null,
    listOrgunit: [],
  },
  reducers: {
    setOrgunit: (state, action) => {
      state.orgunit = action.payload;
    },
    deleteOrgunit: (state, { payload }) => {
      state.orgunit = [];
    },
    setListOrgunit: (state, action) => {
      state.listOrgunit = action.payload;
    },
    deleteListOrgunit: (state, { payload }) => {
      state.listOrgunit = [];
    },
  },
});

export const { setOrgunit, deleteOrgunit, setListOrgunit, deleteListOrgunit } =
  orgunitSlice.actions;
export default orgunitSlice.reducer;

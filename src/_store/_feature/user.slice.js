import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    listUsers: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    addUser: (state, { payload }) => {
      state.listUsers.push(payload);
    },
    deleteUser: (state, { payload }) => {
      state.user = null;
    },
  },
});

export const { setUser, deleteUser, addUser } = userSlice.actions;
export default userSlice.reducer;

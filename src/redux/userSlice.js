import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    // temporarily simulate a logged-in admin user
    currentUser: { username: "admin", role: "admin" },
  },
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

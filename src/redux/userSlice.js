import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null, // ❗ start empty
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;

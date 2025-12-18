import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice"; // import user slice

export default configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer, // add here
  },
});

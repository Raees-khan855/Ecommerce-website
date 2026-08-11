import { createSlice } from "@reduxjs/toolkit";

// Load initial cart from localStorage
const savedCart = localStorage.getItem("cartItems");

const initialState = {
  items: savedCart ? JSON.parse(savedCart) : [],
};

// Save cart to localStorage
const saveCart = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    /* ================= ADD TO CART ================= */
    addToCart: (state, action) => {
      const incoming = action.payload;

      // Always use one consistent ID
      const incomingId = incoming.id || incoming._id;

      const existing = state.items.find(
        (item) =>
          item.id === incomingId &&
          (item.selectedColor || "") === (incoming.selectedColor || "") &&
          (item.selectedSize || "") === (incoming.selectedSize || ""),
      );

      if (existing) {
        // Increase existing quantity
        existing.quantity += Number(incoming.quantity) || 1;
      } else {
        // Add new product
        state.items.push({
          ...incoming,
          id: incomingId,
          quantity: Number(incoming.quantity) || 1,
        });
      }

      saveCart(state.items);
    },

    /* ================= REMOVE FROM CART ================= */
    removeFromCart: (state, action) => {
      const { id, _id, selectedColor = "", selectedSize = "" } = action.payload;

      const productId = id || _id;

      state.items = state.items.filter(
        (item) =>
          !(
            item.id === productId &&
            (item.selectedColor || "") === selectedColor &&
            (item.selectedSize || "") === selectedSize
          ),
      );

      saveCart(state.items);
    },

    /* ================= UPDATE QUANTITY ================= */
    updateQuantity: (state, action) => {
      const {
        id,
        _id,
        selectedColor = "",
        selectedSize = "",
        quantity,
      } = action.payload;

      const productId = id || _id;

      const item = state.items.find(
        (item) =>
          item.id === productId &&
          (item.selectedColor || "") === selectedColor &&
          (item.selectedSize || "") === selectedSize,
      );

      if (item) {
        item.quantity = Math.max(1, Number(quantity));
      }

      saveCart(state.items);
    },

    /* ================= CLEAR CART ================= */
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

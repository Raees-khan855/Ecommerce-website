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

      const incomingId = String(incoming.id || incoming._id);

      const incomingColor = incoming.selectedColor || "";
      const incomingSize = incoming.selectedSize || "";

      const existing = state.items.find(
        (item) =>
          String(item.id) === incomingId &&
          (item.selectedColor || "") === incomingColor &&
          (item.selectedSize || "") === incomingSize,
      );

      if (existing) {
        // Add exactly ONE item
        existing.quantity = Number(existing.quantity || 0) + 1;
      } else {
        // First time adding this product
        state.items.push({
          ...incoming,
          id: incomingId,
          quantity: 1,
          selectedColor: incomingColor,
          selectedSize: incomingSize,
        });
      }

      saveCart(state.items);
    },

    /* ================= REMOVE ================= */
    removeFromCart: (state, action) => {
      const { id, _id, selectedColor = "", selectedSize = "" } = action.payload;

      const productId = String(id || _id);

      state.items = state.items.filter(
        (item) =>
          !(
            String(item.id) === productId &&
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

      const productId = String(id || _id);

      const item = state.items.find(
        (item) =>
          String(item.id) === productId &&
          (item.selectedColor || "") === selectedColor &&
          (item.selectedSize || "") === selectedSize,
      );

      if (item) {
        const newQuantity = Number(quantity);

        if (!Number.isNaN(newQuantity)) {
          item.quantity = Math.max(1, newQuantity);
        }
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

import { createSlice } from "@reduxjs/toolkit";

// Load initial cart from localStorage if found
const savedCart = localStorage.getItem("cartItems");

const initialState = {
  items: savedCart ? JSON.parse(savedCart) : [],
};

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

      // ✅ match id + selectedColor + selectedSize
      const existing = state.items.find(
        (i) =>
          i.id === incoming.id &&
          i.selectedColor === incoming.selectedColor &&
          i.selectedSize === incoming.selectedSize,
      );

      if (existing) {
        existing.quantity += incoming.quantity || 1;
      } else {
        state.items.push({
          ...incoming,
          quantity: incoming.quantity || 1,
        });
      }

      saveCart(state.items);
    },

    /* ================= REMOVE ================= */
    removeFromCart: (state, action) => {
      const { id, selectedColor, selectedSize } = action.payload;

      state.items = state.items.filter(
        (i) =>
          !(
            i.id === id &&
            i.selectedColor === selectedColor &&
            i.selectedSize === selectedSize
          ),
      );

      saveCart(state.items);
    },

    /* ================= UPDATE QTY ================= */
    updateQuantity: (state, action) => {
      const { id, selectedColor, selectedSize, quantity } = action.payload;

      const item = state.items.find(
        (i) =>
          i.id === id &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize,
      );

      if (item) item.quantity = quantity;

      state.items = state.items.filter((i) => i.quantity > 0);

      saveCart(state.items);
    },

    /* ================= CLEAR ================= */
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from "react-icons/fa";

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = useMemo(
    () =>
      Math.round(
        items.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.quantity),
          0,
        ),
      ),
    [items],
  );

  const handleQtyChange = useCallback(
    (item, value) => {
      const quantity = Number(value);

      if (quantity < 1 || Number.isNaN(quantity)) return;

      dispatch(
        updateQuantity({
          id: item.id,
          selectedColor: item.selectedColor || "",
          selectedSize: item.selectedSize || "",
          quantity,
        }),
      );
    },
    [dispatch],
  );

  const handleRemove = useCallback(
    (item) => {
      dispatch(
        removeFromCart({
          id: item.id,
          selectedColor: item.selectedColor || "",
          selectedSize: item.selectedSize || "",
        }),
      );
    },
    [dispatch],
  );

  /* ================= EMPTY CART ================= */
  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div
          className="text-center mx-auto p-5 rounded-4 shadow-sm"
          style={{
            maxWidth: "500px",
            background: "#f8fafc",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-circle"
            style={{
              width: "70px",
              height: "70px",
              background: "#e9f2ff",
              color: "#0d6efd",
            }}
          >
            <FaShoppingBag size={28} />
          </div>

          <h5 className="fw-bold mb-2">Your cart is empty</h5>

          <p className="text-muted small mb-4">
            Looks like you haven't added anything yet.
          </p>

          <button
            className="btn btn-primary btn-sm px-4 rounded-pill"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: "950px" }}>
      {/* ================= HEADER ================= */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="fw-bold mb-1">Shopping Cart</h4>
          <span className="text-muted small">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <button
          className="btn btn-sm btn-outline-danger rounded-pill px-3"
          onClick={() => dispatch(clearCart())}
        >
          <FaTrash size={11} className="me-1" />
          Clear
        </button>
      </div>

      {/* ================= ITEMS ================= */}
      <div className="d-flex flex-column gap-2">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
            className="bg-white border rounded-3 p-2 shadow-sm"
          >
            <div className="d-flex align-items-center gap-3">
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.title}
                width="70"
                height="70"
                className="rounded-3 bg-light"
                style={{
                  objectFit: "contain",
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/70";
                }}
              />

              {/* INFO */}
              <div className="flex-grow-1 min-width-0">
                <h6
                  className="fw-semibold mb-1"
                  style={{
                    fontSize: "14px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.title}
                </h6>

                {/* OPTIONS */}
                {(item.selectedSize || item.selectedColor) && (
                  <div className="text-muted mb-1" style={{ fontSize: "11px" }}>
                    {item.selectedSize && (
                      <span>
                        Size: <b>{item.selectedSize}</b>
                      </span>
                    )}

                    {item.selectedSize && item.selectedColor && (
                      <span className="mx-1">•</span>
                    )}

                    {item.selectedColor && (
                      <span>
                        Color: <b>{item.selectedColor}</b>
                      </span>
                    )}
                  </div>
                )}

                <div
                  className="fw-bold text-primary"
                  style={{ fontSize: "14px" }}
                >
                  Rs. {Number(item.price).toLocaleString()}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="text-end">
                {/* TOTAL */}
                <div className="fw-bold mb-2" style={{ fontSize: "14px" }}>
                  Rs.{" "}
                  {(
                    Number(item.price) * Number(item.quantity)
                  ).toLocaleString()}
                </div>

                {/* QUANTITY */}
                <div
                  className="d-flex align-items-center border rounded-pill overflow-hidden"
                  style={{
                    height: "30px",
                    width: "92px",
                  }}
                >
                  <button
                    className="btn btn-light border-0 p-0"
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                    disabled={item.quantity <= 1}
                    onClick={() => handleQtyChange(item, item.quantity - 1)}
                  >
                    <FaMinus size={9} />
                  </button>

                  <span
                    className="fw-bold text-center flex-grow-1"
                    style={{ fontSize: "12px" }}
                  >
                    {item.quantity}
                  </span>

                  <button
                    className="btn btn-light border-0 p-0"
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                    onClick={() => handleQtyChange(item, item.quantity + 1)}
                  >
                    <FaPlus size={9} />
                  </button>
                </div>
              </div>
            </div>

            {/* REMOVE */}
            <div className="text-end mt-1">
              <button
                className="btn btn-link text-danger p-0"
                style={{ fontSize: "11px" }}
                onClick={() => handleRemove(item)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="mt-4 p-3 rounded-3 border bg-light">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted small">Subtotal</span>

          <span className="fw-semibold small">
            Rs. {total.toLocaleString()}
          </span>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted small">Delivery</span>

          <span className="text-success fw-semibold small">FREE</span>
        </div>

        <hr className="my-2" />

        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">Total</span>

          <span className="fw-bold text-primary" style={{ fontSize: "20px" }}>
            Rs. {total.toLocaleString()}
          </span>
        </div>

        {/* CHECKOUT */}
        <button
          className="btn btn-primary w-100 mt-3 rounded-3 fw-semibold"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout →
        </button>

        <button
          className="btn btn-link btn-sm w-100 text-muted mt-1"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>

      {/* ================= DELIVERY INFO ================= */}
      <div className="text-center mt-3">
        <span className="text-muted" style={{ fontSize: "11px" }}>
          🚚 Delivery within 3–5 days &nbsp; • &nbsp; 💵 Cash on Delivery
        </span>
      </div>
    </div>
  );
}

export default Cart;

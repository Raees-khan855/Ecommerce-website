import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= TOTAL ================= */
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

  /* ================= QUANTITY CHANGE ================= */
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

  /* ================= REMOVE ================= */
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

  /* ================= CHECKOUT ================= */
  const handleCheckout = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  /* ================= EMPTY CART ================= */
  if (items.length === 0) {
    return (
      <div className="container text-center mt-5 py-5">
        <h4>Your cart is empty</h4>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/products")}
        >
          🛍️ Shop Products
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* ================= TITLE ================= */}
      <h1 className="mb-4 text-center fw-semibold">🛒 Shopping Cart</h1>

      {/* ================= CART ITEMS ================= */}
      <div className="list-group mb-4">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
            className="list-group-item d-flex flex-column flex-sm-row align-items-sm-center gap-3 p-3 shadow-sm border-0 mb-2 rounded-3"
          >
            {/* ================= IMAGE ================= */}
            <img
              src={item.image}
              alt={item.title}
              width="80"
              height="80"
              className="rounded bg-light p-2"
              style={{
                objectFit: "contain",
                flexShrink: 0,
              }}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/80";
              }}
            />

            {/* ================= PRODUCT INFO ================= */}
            <div className="flex-grow-1 w-100">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div>
                  <strong>{item.title}</strong>

                  {/* COLOR + SIZE */}
                  <div className="small text-muted mt-1">
                    {item.selectedSize && (
                      <>
                        Size: <b>{item.selectedSize}</b>
                      </>
                    )}

                    {item.selectedSize && item.selectedColor && " | "}

                    {item.selectedColor && (
                      <>
                        Color: <b>{item.selectedColor}</b>
                      </>
                    )}
                  </div>

                  {/* PRICE */}
                  <div className="text-muted small mt-1">
                    Rs. {item.price} each
                  </div>
                </div>

                {/* ITEM TOTAL */}
                <div className="fw-bold text-primary mt-2 mt-md-0">
                  Rs. {Number(item.price) * Number(item.quantity)}
                </div>
              </div>

              {/* ================= QUANTITY + REMOVE ================= */}
              <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
                {/* QUANTITY CONTROLS */}
                <div
                  className="d-flex align-items-center border rounded-3 overflow-hidden"
                  style={{
                    height: "40px",
                    backgroundColor: "#fff",
                  }}
                >
                  {/* MINUS */}
                  <button
                    type="button"
                    className="btn btn-light border-0 px-3"
                    onClick={() => handleQtyChange(item, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                    style={{
                      height: "100%",
                      fontSize: "20px",
                      fontWeight: "bold",
                      lineHeight: 1,
                    }}
                  >
                    −
                  </button>

                  {/* QUANTITY */}
                  <span
                    className="fw-bold text-center"
                    style={{
                      minWidth: "45px",
                      userSelect: "none",
                    }}
                  >
                    {item.quantity}
                  </span>

                  {/* PLUS */}
                  <button
                    type="button"
                    className="btn btn-light border-0 px-3"
                    onClick={() => handleQtyChange(item, item.quantity + 1)}
                    aria-label="Increase quantity"
                    style={{
                      height: "100%",
                      fontSize: "20px",
                      fontWeight: "bold",
                      lineHeight: 1,
                    }}
                  >
                    +
                  </button>
                </div>

                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemove(item)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-4">
        {/* BUTTONS */}
        <div className="d-flex gap-2 flex-wrap mb-3 mb-md-0">
          {/* CLEAR CART */}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => dispatch(clearCart())}
          >
            🧹 Clear Cart
          </button>

          {/* CHECKOUT */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCheckout}
          >
            💳 Proceed to Checkout
          </button>
        </div>

        {/* TOTAL */}
        <h5 className="fw-bold text-primary mt-3 mt-md-0">
          Total: Rs. {total}
        </h5>
      </div>
    </div>
  );
}

export default Cart;

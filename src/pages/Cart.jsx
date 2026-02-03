import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ✅ Memoized total */
  const total = useMemo(
    () =>
      Math.round(
        items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      ),
    [items],
  );

  /* ===== Handle Quantity Change ===== */
  const handleQtyChange = useCallback(
    (item, value) => {
      if (value < 1) return;

      dispatch(
        updateQuantity({
          id: item.id,
          color: item.color,
          size: item.size,
          quantity: value,
        }),
      );
    },
    [dispatch],
  );

  /* ===== Remove ===== */
  const handleRemove = useCallback(
    (item) => {
      dispatch(
        removeFromCart({
          id: item.id,
          color: item.color,
          size: item.size,
        }),
      );
    },
    [dispatch],
  );

  /* ===== Checkout ===== */
  const handleCheckout = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  if (items.length === 0) {
    return (
      <div className="text-center mt-5">
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
      <h1 className="mb-4 text-center fw-semibold">🛒 Shopping Cart</h1>

      <div className="list-group mb-4">
        {items.map((item) => (
          <div
            /* 🔥 key must include size+color */
            key={`${item.id}-${item.color}-${item.size}`}
            className="list-group-item d-flex flex-column flex-sm-row align-items-sm-center gap-3 p-3 shadow-sm border-0 mb-2 rounded-3"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.title}
              width="80"
              height="80"
              className="rounded bg-light p-2"
              style={{ objectFit: "contain" }}
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/80")
              }
            />

            {/* INFO */}
            <div className="flex-grow-1 w-100">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div>
                  <strong>{item.title}</strong>

                  {/* ✅ SHOW COLOR + SIZE */}
                  <div className="small text-muted">
                    Size: <b>{item.size}</b> | Color: <b>{item.color}</b>
                  </div>

                  <div className="text-muted small">Rs. {item.price} each</div>
                </div>

                <div className="fw-bold text-primary mt-2 mt-md-0">
                  Rs. {item.price * item.quantity}
                </div>
              </div>

              {/* QTY */}
              <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQtyChange(item, Number(e.target.value))
                  }
                  className="form-control form-control-sm"
                  style={{ width: "80px" }}
                />

                <button
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

      {/* FOOTER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-4">
        <div className="d-flex gap-2 flex-wrap mb-3 mb-md-0">
          <button
            className="btn btn-outline-secondary"
            onClick={() => dispatch(clearCart())}
          >
            🧹 Clear Cart
          </button>

          <button className="btn btn-primary" onClick={handleCheckout}>
            💳 Proceed to Checkout
          </button>
        </div>

        <h5 className="fw-bold text-primary mt-3 mt-md-0">
          Total: Rs. {total}
        </h5>
      </div>
    </div>
  );
}

export default Cart;

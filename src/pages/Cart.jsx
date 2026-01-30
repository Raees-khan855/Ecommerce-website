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

  /* ===== Handle Quantity Change with TikTok Tracking ===== */
  const handleQtyChange = useCallback(
    (id, value) => {
      const item = items.find((i) => i.id === id);
      if (!item || value < 1) return;

      dispatch(updateQuantity({ id, quantity: value }));

      // TikTok Pixel: AddToCart (quantity update)
      if (window.ttq?.track) {
        window.ttq.track("AddToCart", {
          value: item.price * value,
          currency: "PKR",
          contents: [
            {
              content_id: item.id,
              content_name: item.title,
              quantity: value,
              price: item.price,
              content_type: "product",
            },
          ],
        });
      }
    },
    [dispatch, items],
  );

  /* ===== Handle Item Removal with TikTok Tracking ===== */
  const handleRemove = useCallback(
    (id) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      dispatch(removeFromCart(id));

      // TikTok Pixel: RemoveFromCart
      if (window.ttq?.track) {
        window.ttq.track("RemoveFromCart", {
          value: item.price * item.quantity,
          currency: "PKR",
          contents: [
            {
              content_id: item.id,
              content_name: item.title,
              quantity: item.quantity,
              price: item.price,
              content_type: "product",
            },
          ],
        });
      }
    },
    [dispatch, items],
  );

  /* ===== Handle Checkout with TikTok Tracking ===== */
  const handleCheckout = useCallback(() => {
    if (window.ttq?.track) {
      window.ttq.track("InitiateCheckout", {
        value: total,
        currency: "PKR",
        contents: items.map((item) => ({
          content_id: item.id,
          content_name: item.title,
          quantity: item.quantity,
          price: item.price,
          content_type: "product",
        })),
      });
    }

    navigate("/checkout");
  }, [items, total, navigate]);

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
            key={item.id}
            className="list-group-item d-flex flex-column flex-sm-row align-items-sm-center gap-3 p-3 shadow-sm border-0 mb-2 rounded-3"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
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
                    handleQtyChange(item.id, Number(e.target.value))
                  }
                  className="form-control form-control-sm"
                  style={{ width: "80px" }}
                />

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemove(item.id)}
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

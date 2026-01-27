import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ PKR total (no decimals)
  const total = Math.round(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  if (items.length === 0)
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

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center fw-semibold">🛒 Shopping Cart</h3>

      <div className="list-group mb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="list-group-item d-flex flex-column flex-sm-row align-items-sm-center gap-3 p-3 shadow-sm border-0 mb-2 rounded-3"
          >
            {/* Product Image */}
            <img
              src={item.image}
              alt={item.title}
              className="rounded bg-light p-2"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
              }}
            />

            {/* Product Info */}
            <div className="flex-grow-1 w-100">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div className="mb-2 mb-md-0">
                  <strong className="d-block">{item.title}</strong>
                  <span className="text-muted small">
                    Rs. {item.price} each
                  </span>
                </div>

                <div className="fw-bold text-md-end text-primary">
                  Rs. {item.price * item.quantity}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="mt-3 d-flex align-items-center flex-wrap gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: Number(e.target.value),
                      }),
                    )
                  }
                  className="form-control form-control-sm"
                  style={{ width: "80px" }}
                />

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-4">
        <div className="mb-3 mb-md-0 d-flex flex-wrap gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => dispatch(clearCart())}
          >
            🧹 Clear Cart
          </button>

          {/* ✅ INITIATE CHECKOUT TRACKING */}
          <button
            className="btn btn-primary"
            onClick={() => {
              window.ttq?.track("InitiateCheckout", {
                value: total,
                currency: "PKR",
                contents: items.map((item) => ({
                  content_id: item.id,
                  content_name: item.title,
                  price: item.price,
                  quantity: item.quantity,
                })),
              });

              navigate("/checkout");
            }}
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

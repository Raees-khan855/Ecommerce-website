import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { clearCart } from "../redux/cartSlice";
import { useNavigate, Link } from "react-router-dom";

function Checkout() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
  });

  const total = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    // 🔔 Later: send order to backend
    setTimeout(() => {
      alert(
        "✅ Order placed successfully! Your payment method is Cash on Delivery."
      );
      dispatch(clearCart());
      navigate("/");
    }, 800);
  };

  // ✅ Empty cart UI
  if (items.length === 0)
    return (
      <div className="text-center my-5">
        <h4 className="mb-3">Your cart is empty</h4>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center fw-bold">Checkout</h3>

      <div className="row g-4">
        {/* Customer Info */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm p-4 h-100">
            <h5 className="mb-3">Customer Details</h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email (optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Delivery Address *</label>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Payment Option */}
              <div className="mb-4">
                <label className="form-label mb-2 d-block">
                  Payment Method
                </label>
                <div className="form-check">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked
                    readOnly
                    className="form-check-input"
                    id="cod"
                  />
                  <label htmlFor="cod" className="form-check-label">
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm p-4 h-100">
            <h5 className="mb-3">Order Summary</h5>

            <ul className="list-group list-group-flush mb-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/60?text=No+Image")
                      }
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                        borderRadius: "6px",
                        backgroundColor: "#f8f9fa",
                      }}
                    />
                    <div>
                      <strong className="d-block">{item.title}</strong>
                      <small className="text-muted">
                        Qty: {item.quantity} × ${item.price}
                      </small>
                    </div>
                  </div>
                  <span className="fw-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <h5 className="text-end">
              Total: <span className="text-primary">${total}</span>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

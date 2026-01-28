import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useCallback, useMemo } from "react";
import { clearCart } from "../redux/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../config";
import useSEO from "../hooks/useSEO";

function Checkout() {
  useSEO({
    title: "Secure Checkout | MyShop",
    description:
      "Complete your order securely with Cash on Delivery and fast shipping.",
    url: window.location.href,
  });

  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "", // optional
    phone: "",
    whatsapp: "", // required
    address: "",
    paymentMethod: "COD",
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate total
  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Submit order
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Required fields: name, phone, whatsapp, address
      if (
        !formData.name ||
        !formData.phone ||
        !formData.whatsapp ||
        !formData.address
      ) {
        alert("Please fill all required fields");
        return;
      }

      // Optional email validation
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        alert("Please enter a valid email address");
        return;
      }

      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        await axios.post(`${BACKEND_URL}/orders`, {
          customerName: formData.name,
          email: formData.email || "", // optional, empty string if not entered
          phone: formData.phone,
          whatsapp: formData.whatsapp, // required
          address: formData.address,
          paymentMethod: formData.paymentMethod,
          products: items.map((item) => ({
            productId: item._id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image?.startsWith("http")
              ? item.image
              : `${BACKEND_URL}/${item.image}`,
          })),
          totalAmount,
        });

        // TikTok tracking (optional)
        setTimeout(() => {
          window.ttq?.track("Purchase", {
            value: totalAmount,
            currency: "PKR",
            contents: items.map((item) => ({
              content_id: item._id,
              content_name: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
          });
        }, 0);

        dispatch(clearCart());
        navigate("/order-success");
      } catch (err) {
        console.error("ORDER ERROR:", err.response?.data || err.message);
        alert(
          err.response?.data?.message ||
            "❌ Failed to place order. Check console.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, items, totalAmount, isSubmitting, dispatch, navigate],
  );

  // Empty cart UI
  if (items.length === 0) {
    return (
      <div className="text-center my-5">
        <h4 className="mb-3">Your cart is empty</h4>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="text-center fw-bold mb-2">Secure Checkout</h1>
      <p className="text-center text-muted mb-4">
        Please review your order before placing it
      </p>

      <div className="row g-4">
        {/* CUSTOMER DETAILS */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-lg p-4">
            <h5 className="mb-3 fw-semibold">Customer Details</h5>

            <form onSubmit={handleSubmit} noValidate>
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
                <label className="form-label">
                  Email <span className="text-muted">(optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone *</label>
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
                <label className="form-label">WhatsApp Number *</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
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

              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Payment Method</h6>
                <label className="w-100 border rounded-3 p-4 d-flex gap-3 border-primary bg-light">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="form-check-input mt-1"
                  />
                  <div>
                    <strong className="fs-5">Cash on Delivery</strong>
                    <p className="text-muted mb-0 mt-1">
                      Pay cash at your doorstep.
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-3 fw-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="col-12 col-lg-5">
          <div style={{ position: "sticky", top: "100px" }}>
            <div className="card border-0 shadow-lg p-4">
              <h5 className="mb-3 fw-semibold">Order Summary</h5>

              <ul className="list-group list-group-flush mb-3">
                {items.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `${BACKEND_URL}/${item.image}`
                        }
                        alt={item.title}
                        loading="lazy"
                        width="60"
                        height="60"
                        style={{
                          objectFit: "contain",
                          borderRadius: 6,
                          backgroundColor: "#f8f9fa",
                        }}
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://via.placeholder.com/60")
                        }
                      />
                      <div>
                        <strong>{item.title}</strong>
                        <div className="small text-muted">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>

                    <span className="fw-bold">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <hr />

              <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total</span>
                <span className="text-primary">
                  Rs.{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

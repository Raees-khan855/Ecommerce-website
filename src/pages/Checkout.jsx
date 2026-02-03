import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../config";
import useSEO from "../hooks/useSEO";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Helper to normalize number to +923xxxxxxxxx
const normalizeNumber = (num) => {
  if (!num) return "";
  let cleaned = num.replace(/\D/g, ""); // only digits
  if (cleaned.startsWith("92") && cleaned[2] === "0") {
    cleaned = "92" + cleaned.slice(3);
  } else if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }
  if (!cleaned.startsWith("92")) cleaned = "92" + cleaned; // add country code if missing
  return "+" + cleaned;
};

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
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    paymentMethod: "COD",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalAmount = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  }, [items]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // PHONE INPUT HANDLERS
  const handlePhoneChange = (value) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("92") && cleaned[2] === "0") {
      cleaned = "92" + cleaned.slice(3);
    } else if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }
    if (cleaned.length > 12) cleaned = cleaned.slice(0, 12); // 92 + 10 digits max
    setFormData((prev) => ({ ...prev, phone: cleaned }));
  };

  const handleWhatsAppChange = (value) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("92") && cleaned[2] === "0") {
      cleaned = "92" + cleaned.slice(3);
    } else if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }
    if (cleaned.length > 12) cleaned = cleaned.slice(0, 12);
    setFormData((prev) => ({ ...prev, whatsapp: cleaned }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const name = formData.name.trim();
      const email = formData.email.trim();
      const phone = formData.phone.trim();
      const whatsapp = formData.whatsapp.trim();
      const address = formData.address.trim();

      if (!name || !phone || !whatsapp || !address) {
        alert("Please fill all required fields");
        return;
      }

      // Ensure 10 digits after country code
      if (phone.replace(/^92/, "").length !== 10) {
        alert("Phone number must be 10 digits");
        return;
      }
      if (whatsapp.replace(/^92/, "").length !== 10) {
        alert("WhatsApp number must be 10 digits");
        return;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address");
        return;
      }

      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        const orderPayload = {
          customerName: name,
          email: email || "",
          phone: normalizeNumber(phone),
          whatsapp: normalizeNumber(whatsapp),
          address,
          paymentMethod: formData.paymentMethod,
          products: items.map((item) => ({
            productId: item._id,
            title: item.title,
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 0),
            image: item.image?.startsWith("http")
              ? item.image
              : `${BACKEND_URL}/${item.image}`,
          })),
          totalAmount,
        };

        console.log("Submitting order:", orderPayload);

        await axios.post(`${BACKEND_URL}/orders`, orderPayload);

        dispatch(clearCart());
        navigate("/order-success");
      } catch (err) {
        console.error("ORDER ERROR:", err.response?.data || err.message);
        alert(
          err.response?.data?.message ||
            JSON.stringify(err.response?.data) ||
            "❌ Failed to place order. Check console.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, items, totalAmount, isSubmitting, dispatch, navigate],
  );

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

              {/* PHONE INPUT */}
              <div className="mb-3">
                <label className="form-label">Phone *</label>
                <PhoneInput
                  country={"pk"}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onlyCountries={["pk"]}
                  countryCodeEditable={false}
                  inputStyle={{ width: "100%" }}
                  inputProps={{
                    name: "phone",
                    required: true,
                  }}
                />
              </div>

              {/* WHATSAPP INPUT */}
              <div className="mb-3">
                <label className="form-label">WhatsApp Number *</label>
                <PhoneInput
                  country={"pk"}
                  value={formData.whatsapp}
                  onChange={handleWhatsAppChange}
                  onlyCountries={["pk"]}
                  countryCodeEditable={false}
                  inputStyle={{ width: "100%" }}
                  inputProps={{
                    name: "whatsapp",
                    required: true,
                  }}
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

              {/* PAYMENT METHOD */}
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

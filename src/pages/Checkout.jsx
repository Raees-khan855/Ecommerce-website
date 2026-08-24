import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../config";
import useSEO from "../hooks/useSEO";
import { tiktokTrack } from "../utils/tiktok";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {
  FaUser,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaTruck,
  FaShoppingBag,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

/* ================= NORMALIZE NUMBER ================= */

const normalizeNumber = (num) => {
  if (!num) return "";

  let cleaned = num.replace(/\D/g, "");

  if (cleaned.startsWith("92") && cleaned[2] === "0") {
    cleaned = "92" + cleaned.slice(3);
  } else if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  if (!cleaned.startsWith("92")) {
    cleaned = "92" + cleaned;
  }

  return "+" + cleaned;
};

/* ================= CHECKOUT ================= */

function Checkout() {
  useSEO({
    title: "Secure Checkout | RaeesProduct",
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

  /* ================= SCROLL TOP ================= */

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ================= TOTAL ================= */

  const totalAmount = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  }, [items]);
  /* ================= TIKTOK INITIATE CHECKOUT ================= */

  useEffect(() => {
    if (!items.length || totalAmount <= 0) return;

    tiktokTrack("InitiateCheckout", {
      content_type: "product",
      quantity: items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
      ),
      value: Number(totalAmount),
      currency: "PKR",
    });
  }, [items, totalAmount]);
  /* ================= CHANGE ================= */

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* ================= PHONE ================= */

  const cleanPhone = (value) => {
    let cleaned = value.replace(/\D/g, "");

    if (cleaned.startsWith("92") && cleaned[2] === "0") {
      cleaned = "92" + cleaned.slice(3);
    } else if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }

    if (cleaned.length > 12) {
      cleaned = cleaned.slice(0, 12);
    }

    return cleaned;
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: cleanPhone(value),
    }));
  };

  const handleWhatsAppChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      whatsapp: cleanPhone(value),
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const name = formData.name.trim();
      const email = formData.email.trim();
      const phone = formData.phone.trim();
      const whatsapp = formData.whatsapp.trim();
      const address = formData.address.trim();

      if (!name || !phone || !whatsapp || !address) {
        alert("Please fill all required fields.");
        return;
      }

      if (phone.replace(/^92/, "").length !== 10) {
        alert("Phone number must be 10 digits.");
        return;
      }

      if (whatsapp.replace(/^92/, "").length !== 10) {
        alert("WhatsApp number must be 10 digits.");
        return;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
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
            productId: item.id,
            title: item.title,
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 0),
            selectedColor: item.selectedColor || "",
            selectedSize: item.selectedSize || "",
            image: item.image?.startsWith("http")
              ? item.image
              : `${BACKEND_URL}/${item.image}`,
          })),

          totalAmount,
        };
        const orderResponse = await axios.post(
          `${BACKEND_URL}/orders`,
          orderPayload,
        );

        /* ================= TIKTOK PLACE ORDER ================= */

        tiktokTrack("PlaceAnOrder", {
          content_type: "product",
          quantity: items.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0,
          ),
          value: Number(totalAmount),
          currency: "PKR",
        });

        /* ================= CLEAR CART ================= */

        dispatch(clearCart());

        navigate("/order-success");

        dispatch(clearCart());

        navigate("/order-success");
      } catch (err) {
        console.error("ORDER ERROR:", err.response?.data || err.message);

        alert(
          err.response?.data?.message ||
            "Failed to place order. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, items, totalAmount, isSubmitting, dispatch, navigate],
  );

  /* ================= EMPTY CART ================= */

  if (items.length === 0) {
    return (
      <div
        className="container d-flex align-items-center justify-content-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="text-center">
          <div
            className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{
              width: 90,
              height: 90,
              fontSize: 36,
            }}
          >
            🛒
          </div>

          <h3 className="fw-bold">Your cart is empty</h3>

          <p className="text-muted mb-4">
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="btn btn-primary px-4 py-2 rounded-pill"
          >
            <FaShoppingBag className="me-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div
      className="checkout-page py-4 py-md-5"
      style={{
        background: "#f6f8fb",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        {/* ================= HEADER ================= */}

        <div className="mb-4">
          <Link
            to="/cart"
            className="text-decoration-none text-muted small d-inline-flex align-items-center mb-3"
          >
            <FaArrowLeft className="me-2" />
            Back to Cart
          </Link>

          <div className="text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: 58,
                height: 58,
                background: "#eaf2ff",
                color: "#0d6efd",
                fontSize: 24,
              }}
            >
              🔒
            </div>

            <h1 className="fw-bold mb-2">Secure Checkout</h1>

            <p className="text-muted mb-0">
              Complete your details and place your order
            </p>
          </div>
        </div>

        {/* ================= PROGRESS ================= */}

        <div className="checkout-progress bg-white rounded-4 shadow-sm p-3 mb-4">
          <div className="row text-center">
            <div className="col-4">
              <div className="text-primary fw-bold">
                <FaShoppingBag />
              </div>
              <small className="fw-semibold">Cart</small>
            </div>

            <div className="col-4">
              <div className="text-primary fw-bold">
                <FaUser />
              </div>
              <small className="fw-semibold">Checkout</small>
            </div>

            <div className="col-4">
              <div className="text-muted fw-bold">
                <FaCheckCircle />
              </div>
              <small className="text-muted">Complete</small>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* ================= CUSTOMER FORM ================= */}

          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-3 p-md-4">
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: 44,
                      height: 44,
                      background: "#eaf2ff",
                      color: "#0d6efd",
                    }}
                  >
                    <FaUser />
                  </div>

                  <div>
                    <h5 className="fw-bold mb-1">Customer Information</h5>

                    <p className="text-muted small mb-0">
                      Enter your delivery details
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {/* NAME */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Full Name <span className="text-danger">*</span>
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaUser className="text-muted" />
                      </span>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control border-start-0 ps-0"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email{" "}
                      <span className="text-muted fw-normal">(optional)</span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="example@email.com"
                    />
                  </div>

                  {/* PHONE */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Phone Number <span className="text-danger">*</span>
                    </label>

                    <div className="checkout-phone">
                      <PhoneInput
                        country="pk"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onlyCountries={["pk"]}
                        countryCodeEditable={false}
                        inputStyle={{
                          width: "100%",
                          height: "48px",
                          borderRadius: "10px",
                          border: "1px solid #dee2e6",
                        }}
                        buttonStyle={{
                          borderRadius: "10px 0 0 10px",
                          border: "1px solid #dee2e6",
                        }}
                        inputProps={{
                          name: "phone",
                          required: true,
                        }}
                      />
                    </div>
                  </div>

                  {/* WHATSAPP */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      WhatsApp Number <span className="text-danger">*</span>
                    </label>

                    <div className="checkout-phone">
                      <PhoneInput
                        country="pk"
                        value={formData.whatsapp}
                        onChange={handleWhatsAppChange}
                        onlyCountries={["pk"]}
                        countryCodeEditable={false}
                        inputStyle={{
                          width: "100%",
                          height: "48px",
                          borderRadius: "10px",
                          border: "1px solid #dee2e6",
                        }}
                        buttonStyle={{
                          borderRadius: "10px 0 0 10px",
                          border: "1px solid #dee2e6",
                        }}
                        inputProps={{
                          name: "whatsapp",
                          required: true,
                        }}
                      />
                    </div>

                    <small className="text-muted">
                      We'll use WhatsApp to confirm your order.
                    </small>
                  </div>

                  {/* ADDRESS */}

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Delivery Address <span className="text-danger">*</span>
                    </label>

                    <div className="position-relative">
                      <FaMapMarkerAlt
                        className="position-absolute text-muted"
                        style={{
                          top: 16,
                          left: 14,
                          zIndex: 2,
                        }}
                      />

                      <textarea
                        name="address"
                        rows="4"
                        value={formData.address}
                        onChange={handleChange}
                        className="form-control ps-5"
                        placeholder="House/Flat #, Street, Area, City"
                        required
                        style={{
                          resize: "vertical",
                        }}
                      />
                    </div>
                  </div>

                  {/* PAYMENT */}

                  <div className="mb-4">
                    <label className="form-label fw-bold">Payment Method</label>

                    <div
                      className="border rounded-4 p-3"
                      style={{
                        background: "linear-gradient(135deg,#f0fff5,#ffffff)",
                        borderColor: "#b7e4c7",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: 48,
                            height: 48,
                            background: "#dff7e8",
                            color: "#198754",
                          }}
                        >
                          <FaMoneyBillWave size={21} />
                        </div>

                        <div className="flex-grow-1">
                          <div className="fw-bold">Cash on Delivery</div>

                          <small className="text-muted">
                            Pay when your order arrives at your doorstep.
                          </small>
                        </div>

                        <FaCheckCircle className="text-success" size={22} />
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-100 py-3 rounded-3 fw-bold"
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="me-2" />
                        Place Order — Rs. {totalAmount.toFixed(0)}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ================= TRUST ================= */}

            <div className="row g-3 mt-1">
              <div className="col-4">
                <div className="bg-white rounded-4 shadow-sm p-3 text-center h-100">
                  <FaShieldAlt className="text-primary mb-2" size={20} />

                  <div className="small fw-semibold">Secure</div>
                </div>
              </div>

              <div className="col-4">
                <div className="bg-white rounded-4 shadow-sm p-3 text-center h-100">
                  <FaTruck className="text-primary mb-2" size={20} />

                  <div className="small fw-semibold">Fast Delivery</div>
                </div>
              </div>

              <div className="col-4">
                <div className="bg-white rounded-4 shadow-sm p-3 text-center h-100">
                  <FaMoneyBillWave className="text-success mb-2" size={20} />

                  <div className="small fw-semibold">COD Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= ORDER SUMMARY ================= */}

          <div className="col-12 col-lg-5">
            <div
              style={{
                position: "sticky",
                top: "90px",
              }}
            >
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="fw-bold mb-1">Your Order</h5>

                      <small className="text-muted">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </small>
                    </div>

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 44,
                        height: 44,
                        background: "#eaf2ff",
                        color: "#0d6efd",
                      }}
                    >
                      <FaShoppingBag />
                    </div>
                  </div>

                  {/* ITEMS */}

                  <div>
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                        className="d-flex gap-3 pb-3 mb-3 border-bottom"
                      >
                        {/* IMAGE */}

                        <div
                          className="rounded-3 bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: 72,
                            height: 72,
                          }}
                        >
                          <img
                            src={
                              item.image?.startsWith("http")
                                ? item.image
                                : `${BACKEND_URL}/${item.image}`
                            }
                            alt={item.title}
                            width="64"
                            height="64"
                            style={{
                              objectFit: "contain",
                              maxWidth: "100%",
                            }}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/64";
                            }}
                          />
                        </div>

                        {/* INFO */}

                        <div className="flex-grow-1 min-width-0">
                          <div
                            className="fw-semibold"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.title}
                          </div>

                          <div className="small text-muted mt-1">
                            Qty: {item.quantity}
                            {item.selectedSize && (
                              <> · Size: {item.selectedSize}</>
                            )}
                          </div>

                          {item.selectedColor && (
                            <div className="small text-muted d-flex align-items-center mt-1">
                              Color:
                              <span
                                className="ms-1"
                                style={{
                                  width: 13,
                                  height: 13,
                                  borderRadius: "50%",
                                  background: item.selectedColor,
                                  border: "1px solid #ccc",
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* PRICE */}

                        <div className="fw-bold text-end flex-shrink-0">
                          Rs.
                          {(Number(item.price) * Number(item.quantity)).toFixed(
                            0,
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* TOTAL */}

                  <div className="pt-1">
                    <div className="d-flex justify-content-between text-muted mb-2">
                      <span>Subtotal</span>

                      <span>Rs. {totalAmount.toFixed(0)}</span>
                    </div>

                    <div className="d-flex justify-content-between text-muted mb-3">
                      <span>Delivery</span>

                      <span className="text-success fw-semibold">FREE</span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5">Total</span>

                      <span className="fw-bold text-primary fs-4">
                        Rs. {totalAmount.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= DELIVERY BOX ================= */}

              <div className="bg-white rounded-4 shadow-sm p-3 mt-3">
                <div className="d-flex align-items-center mb-2">
                  <FaTruck className="text-primary me-3" />

                  <div>
                    <div className="fw-semibold">Fast Delivery</div>

                    <small className="text-muted">
                      Delivery available across Pakistan
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <FaWhatsapp className="text-success me-3" />

                  <div>
                    <div className="fw-semibold">WhatsApp Confirmation</div>

                    <small className="text-muted">
                      We'll contact you before dispatch
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SMALL CSS ================= */}

      <style>{`

        .checkout-page .form-control {
          min-height: 48px;
          border-radius: 10px;
          border-color: #dee2e6;
        }

        .checkout-page .form-control:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 .2rem rgba(13,110,253,.08);
        }

        .checkout-page .input-group-text {
          border-radius: 10px 0 0 10px;
        }

        .checkout-page .input-group .form-control {
          border-radius: 0 10px 10px 0;
        }

        .checkout-progress {
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 575px) {

          .checkout-page {
            padding-top: 20px !important;
          }

          .checkout-page h1 {
            font-size: 27px;
          }

          .checkout-progress {
            padding: 12px !important;
          }

        }

      `}</style>
    </div>
  );
}

export default Checkout;

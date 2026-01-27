import { Link } from "react-router-dom";
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { useEffect } from "react";

const OrderSuccess = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // ⚠️ IMPORTANT:
    // Purchase event already fired in Checkout
    // Do NOT fire again here (avoids duplicate conversion + better performance)
  }, []);

  return (
    <main className="container my-5">
      <section
        className="card border-0 shadow-lg text-center mx-auto p-4 p-md-5"
        style={{ maxWidth: 600 }}
      >
        {/* ICON */}
        <FaCheckCircle
          size={80}
          className="text-success mb-3"
          aria-hidden="true"
        />

        {/* TITLE */}
        <h1 className="fw-bold mb-2">Order Placed Successfully 🎉</h1>

        {/* TEXT */}
        <p className="text-muted mb-4">
          Thank you for shopping with <strong>RaeesProduct</strong>.
          <br />
          Your order has been received and will be delivered soon.
        </p>

        {/* INFO */}
        <div className="alert alert-success mb-4" role="alert">
          💰 <strong>Payment Method:</strong> Cash on Delivery
          <br />
          🚚 <strong>Free & Fast Delivery</strong> all over Pakistan
        </div>

        {/* CTA */}
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/products" className="btn btn-outline-primary">
            Continue Shopping
          </Link>

          <a
            href="https://wa.me/923254555681"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success d-flex align-items-center gap-2"
          >
            <FaWhatsapp aria-hidden="true" />
            Contact on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
};

export default OrderSuccess;

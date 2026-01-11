import { Link } from "react-router-dom";
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { useEffect } from "react";

const OrderSuccess = () => {
  // ✅ Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container my-5">
      <div
        className="card border-0 shadow-lg p-5 text-center mx-auto"
        style={{ maxWidth: "600px" }}
      >
        {/* Success Icon */}
        <FaCheckCircle size={80} className="text-success mb-3" />

        {/* Heading */}
        <h2 className="fw-bold mb-2">Order Placed Successfully! 🎉</h2>

        {/* Message */}
        <p className="text-muted mb-4">
          Thank you for shopping with <strong>RaeesProduct</strong>.
          <br />
          Your order has been received and will be delivered soon.
        </p>

        {/* Info */}
        <div className="alert alert-success">
          💰 <strong>Payment Method:</strong> Cash on Delivery <br />
          🚚 <strong>Free & Fast Delivery</strong> all over Pakistan
        </div>

        {/* Actions */}
        <div className="d-flex gap-3 justify-content-center mt-4 flex-wrap">
          <Link to="/products" className="btn btn-outline-primary">
            Continue Shopping
          </Link>

          <a
            href="https://wa.me/923254555681"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success d-flex align-items-center gap-2"
          >
            <FaWhatsapp />
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

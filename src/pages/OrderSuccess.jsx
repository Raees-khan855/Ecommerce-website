import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaWhatsapp,
  FaShoppingBag,
  FaTruck,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";
import { useEffect } from "react";

const OrderSuccess = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Purchase event is already fired in Checkout.
    // Do NOT fire it again here.
  }, []);

  return (
    <main
      className="py-5"
      style={{
        minHeight: "calc(100vh - 70px)",
        background:
          "linear-gradient(135deg, #f5f9ff 0%, #eef7f2 50%, #ffffff 100%)",
      }}
    >
      <div className="container">
        <section
          className="bg-white mx-auto text-center rounded-4 shadow-lg overflow-hidden"
          style={{
            maxWidth: 680,
            border: "1px solid #edf0f3",
          }}
        >
          {/* TOP SUCCESS AREA */}
          <div
            className="p-4 p-md-5"
            style={{
              background: "linear-gradient(135deg, #f0fff5, #ffffff)",
            }}
          >
            {/* SUCCESS ICON */}
            <div
              className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 100,
                height: 100,
                background: "#e8f8ee",
                boxShadow: "0 10px 30px rgba(25,135,84,.12)",
              }}
            >
              <FaCheckCircle
                size={68}
                className="text-success"
                aria-hidden="true"
              />
            </div>

            {/* TITLE */}
            <h1 className="fw-bold mb-3">Order Placed Successfully!</h1>

            <p
              className="text-muted mx-auto mb-0"
              style={{
                maxWidth: 500,
                lineHeight: 1.7,
              }}
            >
              Thank you for shopping with{" "}
              <strong className="text-dark">RaeesProduct</strong>. Your order
              has been received successfully and will be processed shortly.
            </p>
          </div>

          {/* ORDER INFO */}
          <div className="px-4 px-md-5 pb-4">
            <div
              className="rounded-4 p-3 p-md-4 mb-4"
              style={{
                background: "#f8fafc",
                border: "1px solid #e9edf2",
              }}
            >
              <div className="row g-3">
                {/* COD */}
                <div className="col-12 col-sm-4">
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                      style={{
                        width: 48,
                        height: 48,
                        background: "#e8f8ee",
                        color: "#198754",
                      }}
                    >
                      <FaMoneyBillWave />
                    </div>

                    <strong className="small">Cash on Delivery</strong>

                    <span className="text-muted small mt-1">Payment</span>
                  </div>
                </div>

                {/* DELIVERY */}
                <div className="col-12 col-sm-4">
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                      style={{
                        width: 48,
                        height: 48,
                        background: "#e8f0ff",
                        color: "#0d6efd",
                      }}
                    >
                      <FaTruck />
                    </div>

                    <strong className="small">Fast Delivery</strong>

                    <span className="text-muted small mt-1">
                      Across Pakistan
                    </span>
                  </div>
                </div>

                {/* SECURE */}
                <div className="col-12 col-sm-4">
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                      style={{
                        width: 48,
                        height: 48,
                        background: "#fff4e5",
                        color: "#fd7e14",
                      }}
                    >
                      <FaShieldAlt />
                    </div>

                    <strong className="small">Secure Order</strong>

                    <span className="text-muted small mt-1">
                      Carefully packed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2">What happens next?</h6>

              <p className="text-muted small mb-0">
                We may contact you to confirm your order before dispatch. Please
                keep your phone available.
              </p>
            </div>

            {/* BUTTONS */}
            <div className="d-grid gap-2">
              <Link
                to="/products"
                className="btn btn-primary py-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
              >
                <FaShoppingBag />
                Continue Shopping
              </Link>

              <a
                href="https://wa.me/923254555681"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success py-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
              >
                <FaWhatsapp size={20} />
                Contact Us on WhatsApp
              </a>
            </div>

            {/* FOOTER NOTE */}
            <p className="text-muted small mt-4 mb-0">
              Thank you for choosing <strong>RaeesProduct</strong> ❤️
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OrderSuccess;

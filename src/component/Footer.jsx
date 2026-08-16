import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp,
  FaTruck,
  FaShieldAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="text-light mt-5"
      style={{
        background:
          "linear-gradient(135deg, #111827 0%, #0f172a 50%, #020617 100%)",
      }}
    >
      {/* ================= TRUST FEATURES ================= */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="container py-4">
          <div className="row g-4 text-center">
            {/* Fast Delivery */}
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(13,110,253,0.15)",
                    color: "#60a5fa",
                  }}
                >
                  <FaTruck size={20} />
                </div>

                <div className="text-start">
                  <div className="fw-bold">Fast Delivery</div>
                  <div className="small text-secondary">
                    Delivery within 3–5 days
                  </div>
                </div>
              </div>
            </div>

            {/* Secure Shopping */}
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(25,135,84,0.15)",
                    color: "#4ade80",
                  }}
                >
                  <FaShieldAlt size={20} />
                </div>

                <div className="text-start">
                  <div className="fw-bold">Secure Shopping</div>
                  <div className="small text-secondary">
                    Safe & reliable service
                  </div>
                </div>
              </div>
            </div>

            {/* COD */}
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(255,193,7,0.15)",
                    color: "#facc15",
                  }}
                >
                  <FaMoneyBillWave size={20} />
                </div>

                <div className="text-start">
                  <div className="fw-bold">Cash on Delivery</div>
                  <div className="small text-secondary">
                    Pay when your order arrives
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <div className="container py-5">
        <div className="row g-5">
          {/* ================= BRAND ================= */}
          <div className="col-12 col-lg-4">
            <Link
              to="/"
              onClick={scrollTop}
              className="text-decoration-none text-light"
            >
              <h3 className="fw-bold mb-3">
                Raees<span className="text-primary">Product</span>
              </h3>
            </Link>

            <p
              className="text-secondary"
              style={{
                lineHeight: "1.8",
                maxWidth: 420,
              }}
            >
              Discover quality products at affordable prices. Shop easily online
              with Cash on Delivery and reliable delivery across Pakistan.
            </p>

            {/* Social Icons */}
            <div className="d-flex gap-2 mt-4">
              <a
                href="#"
                aria-label="Facebook"
                className="d-flex align-items-center justify-content-center rounded-circle text-light text-decoration-none"
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <FaFacebookF size={15} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="d-flex align-items-center justify-content-center rounded-circle text-light text-decoration-none"
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="#"
                aria-label="TikTok"
                className="d-flex align-items-center justify-content-center rounded-circle text-light text-decoration-none"
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <FaTiktok size={15} />
              </a>

              <a
                href="https://wa.me/923004555681"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="d-flex align-items-center justify-content-center rounded-circle text-light text-decoration-none"
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(25,135,84,0.25)",
                }}
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div className="col-6 col-md-4 col-lg-2">
            <h6 className="fw-bold mb-4">Quick Links</h6>

            <ul className="list-unstyled mb-0">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Cart", path: "/cart" },
                { name: "Checkout", path: "/checkout" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path} className="mb-3">
                  <Link
                    to={link.path}
                    onClick={scrollTop}
                    className="text-secondary text-decoration-none footer-link"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= CATEGORIES ================= */}
          <div className="col-6 col-md-4 col-lg-3">
            <h6 className="fw-bold mb-4">Categories</h6>

            <ul className="list-unstyled mb-0">
              <li className="mb-3">
                <Link
                  to="/products?category=watch"
                  onClick={scrollTop}
                  className="text-secondary text-decoration-none footer-link"
                >
                  ⌚ Watches
                </Link>
              </li>

              <li className="mb-3">
                <Link
                  to="/products?category=earbuds"
                  onClick={scrollTop}
                  className="text-secondary text-decoration-none footer-link"
                >
                  🎧 Earbuds
                </Link>
              </li>

              <li className="mb-3">
                <Link
                  to="/products?category=beauty"
                  onClick={scrollTop}
                  className="text-secondary text-decoration-none footer-link"
                >
                  💄 Beauty
                </Link>
              </li>

              <li className="mb-3">
                <Link
                  to="/products?category=electronics"
                  onClick={scrollTop}
                  className="text-secondary text-decoration-none footer-link"
                >
                  🔌 Electronics
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= CONTACT ================= */}
          <div className="col-12 col-md-4 col-lg-3">
            <h6 className="fw-bold mb-4">Contact Us</h6>

            <div className="d-flex gap-3 mb-3">
              <FaMapMarkerAlt
                className="text-primary mt-1"
                style={{ minWidth: 16 }}
              />

              <span className="text-secondary small">Pakistan</span>
            </div>

            <div className="d-flex gap-3 mb-3">
              <FaPhoneAlt
                className="text-primary mt-1"
                style={{ minWidth: 16 }}
              />

              <a
                href="tel:+923254555681"
                className="text-secondary text-decoration-none small footer-link"
              >
                +92 325 4555681
              </a>
            </div>

            <div className="d-flex gap-3 mb-3">
              <FaEnvelope
                className="text-primary mt-1"
                style={{ minWidth: 16 }}
              />

              <a
                href="mailto:support@sigmaraees183@gmail.com"
                className="text-secondary text-decoration-none small footer-link"
                style={{ wordBreak: "break-word" }}
              >
                support@sigmaraees183@gmail.com
              </a>
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/923004555681"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-sm mt-2 px-3"
            >
              <FaWhatsapp className="me-2" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* ================= DIVIDER ================= */}
        <hr
          className="my-5"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
          }}
        />

        {/* ================= BOTTOM ================= */}
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-6 text-center text-md-start">
            <p className="small text-secondary mb-0">
              © {currentYear}{" "}
              <span className="text-light fw-semibold">RaeesProduct</span>. All
              rights reserved.
            </p>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-3">
              <span className="small text-secondary">Secure Shopping</span>

              <button
                onClick={scrollTop}
                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 38,
                  height: 38,
                }}
                aria-label="Back to top"
              >
                <FaArrowUp size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SMALL FOOTER CSS ================= */}
      <style>{`
        .footer-link {
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          color: #fff !important;
          padding-left: 4px;
        }

        footer a {
          transition: all 0.2s ease;
        }

        footer .rounded-circle:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.15) !important;
        }
      `}</style>
    </footer>
  );
}

export default React.memo(Footer);

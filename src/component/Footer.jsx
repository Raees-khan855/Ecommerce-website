import React, { useMemo } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-dark text-light mt-5">
      <div className="container py-4">
        <div className="row gy-4 text-center text-md-start">
          {/* Brand */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold">RaeesProduct</h5>
            <p className="small text-muted mb-0">
              Trusted supplier of industrial & chemical containers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-sm-6 col-md-4">
            <h6 className="fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled small mb-0">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Cart", path: "/cart" },
                { name: "Checkout", path: "/checkout" },
              ].map((link) => (
                <li key={link.path} className="mb-2">
                  <Link
                    to={link.path}
                    onClick={scrollTop}
                    className="text-light text-decoration-none"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-sm-6 col-md-4">
            <h6 className="fw-semibold mb-3">Contact</h6>
            <p className="small mb-2">📍 Pakistan</p>
            <p className="small mb-2">
              <a
                href="tel:+923254555681"
                className="text-light text-decoration-none"
              >
                📞 +92 325 4555681
              </a>
            </p>
            <p className="small mb-0">
              <a
                href="mailto:support@sigmaraees183@gmail.com"
                className="text-light text-decoration-none"
              >
                ✉️ support@sigmaraees183@gmail.com
              </a>
            </p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <p className="text-center small mb-0 text-muted">
          © {currentYear} RaeesProduct. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ✅ Memoize Footer to avoid re-render on parent changes
export default React.memo(Footer);

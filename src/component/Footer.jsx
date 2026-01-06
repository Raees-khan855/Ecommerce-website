import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5">
      <div className="container py-4">
        <div className="row text-center text-md-start">
          {/* Brand */}
          <div className="col-12 col-md-4 mb-3">
            <h5 className="fw-bold">RaeesProduct</h5>
            <p className="small text-muted mb-0">
              Trusted supplier of industrial & chemical containers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-4 mb-3">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-1">
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/products"
                  className="text-light text-decoration-none"
                >
                  Products
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/cart" className="text-light text-decoration-none">
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/checkout"
                  className="text-light text-decoration-none"
                >
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-6 col-md-4 mb-3">
            <h6 className="fw-semibold">Contact</h6>
            <p className="small mb-1">📍 India</p>
            <p className="small mb-1">
              <a
                href="tel:+919876543210"
                className="text-light text-decoration-none"
              >
                📞 +91 98765 43210
              </a>
            </p>
            <p className="small mb-0">
              <a
                href="mailto:support@raeesproduct.com"
                className="text-light text-decoration-none"
              >
                ✉️ support@raeesproduct.com
              </a>
            </p>
          </div>
        </div>

        <hr className="border-secondary my-3" />

        <p className="text-center small mb-0 text-muted">
          © {new Date().getFullYear()} RaeesProduct. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart?.items || []);

  // ✅ Memoize cart count
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems],
  );

  const navLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active fw-semibold" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          RaeesProduct
        </Link>

        {/* Right-side: Hamburger + Mobile Cart */}
        <div className="d-flex align-items-center">
          {/* Cart Icon (mobile only) */}
          <NavLink
            to="/cart"
            className="btn btn-primary d-lg-none position-relative me-2"
          >
            🛒
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* Mobile Toggle (React state instead of Bootstrap JS) */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>

        {/* Collapsible Menu */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/products"
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/contact"
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </NavLink>
            </li>
          </ul>

          {/* Desktop Cart Icon */}
          <div className="d-none d-lg-flex align-items-center">
            <NavLink to="/cart" className="btn btn-primary position-relative">
              🛒 Cart
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ✅ Memoize Navbar to avoid unnecessary re-renders
export default Navbar;

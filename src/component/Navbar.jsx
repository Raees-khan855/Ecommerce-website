import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import {
  FaShoppingCart,
  FaHome,
  FaBoxOpen,
  FaPhoneAlt,
  FaBars,
  FaTimes,
  FaTruck,
} from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart?.items || []);

  /* ================= CART COUNT ================= */

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems],
  );

  /* ================= CLOSE MENU ================= */

  const closeMenu = () => {
    setIsOpen(false);
  };

  /* ================= NAV LINK ================= */

  const navLinkClass = ({ isActive }) =>
    `nav-link-custom ${isActive ? "nav-link-active" : ""}`;

  return (
    <>
      {/* ================= TOP SHIPPING BAR ================= */}

      <div className="navbar-topbar">
        <div className="container text-center">
          <span>
            <FaTruck className="me-2" />
            Fast Delivery in 3–5 Days
          </span>

          <span className="topbar-divider">•</span>

          <span>Cash on Delivery Available</span>
        </div>
      </div>

      {/* ================= NAVBAR ================= */}

      <nav
        className="navbar-main sticky-top"
        style={{
          zIndex: 1030,
        }}
      >
        <div className="container">
          <div className="navbar-inner">
            {/* ================= BRAND ================= */}

            <Link to="/" className="brand-logo" onClick={closeMenu}>
              <div className="brand-icon">R</div>

              <div className="brand-text">
                <span className="brand-name">RaeesProduct</span>

                <span className="brand-tagline">Shop Smart. Shop Easy.</span>
              </div>
            </Link>

            {/* ================= DESKTOP MENU ================= */}

            <div className="desktop-navigation">
              <NavLink to="/" end className={navLinkClass}>
                <FaHome />
                <span>Home</span>
              </NavLink>

              <NavLink to="/products" className={navLinkClass}>
                <FaBoxOpen />
                <span>Products</span>
              </NavLink>

              <NavLink to="/contact" className={navLinkClass}>
                <FaPhoneAlt />
                <span>Contact</span>
              </NavLink>
            </div>

            {/* ================= DESKTOP CART ================= */}

            <div className="desktop-cart">
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `cart-button ${isActive ? "cart-button-active" : ""}`
                }
              >
                <FaShoppingCart />

                <span className="cart-text">Cart</span>

                {cartCount > 0 && (
                  <span className="cart-badge">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </NavLink>
            </div>

            {/* ================= MOBILE RIGHT ================= */}

            <div className="mobile-actions">
              {/* Mobile Cart */}

              <NavLink to="/cart" className="mobile-cart" onClick={closeMenu}>
                <FaShoppingCart />

                {cartCount > 0 && (
                  <span className="mobile-cart-badge">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </NavLink>

              {/* Mobile Menu */}

              <button
                type="button"
                className="mobile-menu-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation"
                aria-expanded={isOpen}
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* ================= MOBILE MENU ================= */}

          <div
            className={`mobile-navigation ${
              isOpen ? "mobile-navigation-open" : ""
            }`}
          >
            <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
              <FaHome />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/products"
              className={navLinkClass}
              onClick={closeMenu}
            >
              <FaBoxOpen />
              <span>Products</span>
            </NavLink>

            <NavLink to="/contact" className={navLinkClass} onClick={closeMenu}>
              <FaPhoneAlt />
              <span>Contact Us</span>
            </NavLink>

            {/* Mobile Cart */}

            <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
              <FaShoppingCart />

              <span>Shopping Cart</span>

              {cartCount > 0 && (
                <span className="mobile-menu-cart-count">
                  {cartCount} items
                </span>
              )}
            </NavLink>

            {/* Mobile Delivery Info */}

            <div className="mobile-delivery-info">
              <FaTruck />

              <div>
                <strong>Delivery in 3–5 Days</strong>

                <small>Cash on Delivery available</small>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= NAVBAR CSS ================= */}

      <style>{`

        /* =========================================
           TOP BAR
        ========================================= */

        .navbar-topbar {
          background: #111827;
          color: #ffffff;
          font-size: 12px;
          font-weight: 500;
          padding: 7px 0;
        }

        .navbar-topbar svg {
          color: #22c55e;
        }

        .topbar-divider {
          margin: 0 10px;
          opacity: .5;
        }


        /* =========================================
           MAIN NAVBAR
        ========================================= */

        .navbar-main {
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #e9ecef;
        }

        .navbar-inner {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }


        /* =========================================
           BRAND
        ========================================= */

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #111827;
          flex-shrink: 0;
        }

        .brand-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: linear-gradient(
            135deg,
            #0d6efd,
            #4f46e5
          );

          color: white;
          font-size: 21px;
          font-weight: 800;

          box-shadow:
            0 6px 15px rgba(13,110,253,.25);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -.3px;
        }

        .brand-tagline {
          font-size: 9px;
          color: #6b7280;
          margin-top: 3px;
        }


        /* =========================================
           DESKTOP NAVIGATION
        ========================================= */

        .desktop-navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex: 1;
        }

        .nav-link-custom {
          position: relative;

          display: flex;
          align-items: center;
          gap: 7px;

          padding: 9px 15px;

          border-radius: 10px;

          text-decoration: none;

          color: #4b5563;

          font-size: 14px;
          font-weight: 600;

          transition:
            background .2s ease,
            color .2s ease,
            transform .2s ease;
        }

        .nav-link-custom svg {
          font-size: 13px;
        }

        .nav-link-custom:hover {
          background: #f3f6fa;
          color: #0d6efd;
          transform: translateY(-1px);
        }

        .nav-link-active {
          background: #edf4ff;
          color: #0d6efd !important;
        }

        .nav-link-active::after {
          content: "";
          position: absolute;

          bottom: -1px;
          left: 50%;

          width: 18px;
          height: 3px;

          border-radius: 20px;

          background: #0d6efd;

          transform: translateX(-50%);
        }


        /* =========================================
           CART
        ========================================= */

        .desktop-cart {
          flex-shrink: 0;
        }

        .cart-button {
          position: relative;

          display: flex;
          align-items: center;
          gap: 9px;

          padding: 10px 15px;

          border-radius: 12px;

          background: #111827;
          color: #ffffff;

          text-decoration: none;

          font-size: 14px;
          font-weight: 600;

          transition:
            transform .2s ease,
            background .2s ease,
            box-shadow .2s ease;
        }

        .cart-button:hover {
          background: #0d6efd;
          color: #ffffff;

          transform: translateY(-2px);

          box-shadow:
            0 7px 18px rgba(13,110,253,.2);
        }

        .cart-button-active {
          background: #0d6efd;
        }

        .cart-badge {
          position: absolute;

          top: -7px;
          right: -7px;

          min-width: 21px;
          height: 21px;

          padding: 0 5px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #dc3545;
          color: #ffffff;

          border: 2px solid #ffffff;

          border-radius: 50px;

          font-size: 10px;
          font-weight: 800;
        }


        /* =========================================
           MOBILE ACTIONS
        ========================================= */

        .mobile-actions {
          display: none;
          align-items: center;
          gap: 8px;
        }

        .mobile-cart {
          position: relative;

          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #111827;
          text-decoration: none;

          border-radius: 11px;

          background: #f3f4f6;

          transition: .2s ease;
        }

        .mobile-cart:hover {
          background: #e8eef8;
          color: #0d6efd;
        }

        .mobile-cart-badge {
          position: absolute;

          top: -4px;
          right: -4px;

          min-width: 19px;
          height: 19px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0 4px;

          background: #dc3545;
          color: #fff;

          border: 2px solid #fff;

          border-radius: 50px;

          font-size: 9px;
          font-weight: 800;
        }

        .mobile-menu-button {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 11px;

          background: #111827;
          color: #fff;

          font-size: 18px;

          transition: .2s ease;
        }

        .mobile-menu-button:hover {
          background: #0d6efd;
        }


        /* =========================================
           MOBILE MENU
        ========================================= */

        .mobile-navigation {
          display: none;

          padding: 10px 0 18px;

          border-top: 1px solid #eef0f3;
        }

        .mobile-navigation-open {
          display: block;
          animation: navbarSlide .2s ease;
        }

        .mobile-navigation .nav-link-custom {
          margin-bottom: 5px;
          padding: 13px 15px;
          width: 100%;
        }

        .mobile-navigation .nav-link-custom::after {
          display: none;
        }

        .mobile-menu-cart-count {
          margin-left: auto;

          font-size: 11px;

          padding: 4px 8px;

          background: #e9f2ff;
          color: #0d6efd;

          border-radius: 20px;
        }


        /* =========================================
           DELIVERY INFO
        ========================================= */

        .mobile-delivery-info {
          margin-top: 12px;

          padding: 12px;

          display: flex;
          align-items: center;
          gap: 12px;

          border-radius: 12px;

          background: #f0fdf4;
          color: #15803d;
        }

        .mobile-delivery-info > svg {
          font-size: 20px;
        }

        .mobile-delivery-info div {
          display: flex;
          flex-direction: column;
        }

        .mobile-delivery-info strong {
          font-size: 12px;
        }

        .mobile-delivery-info small {
          font-size: 10px;
          color: #6b7280;
          margin-top: 2px;
        }


        /* =========================================
           ANIMATION
        ========================================= */

        @keyframes navbarSlide {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 991.98px) {

          .desktop-navigation,
          .desktop-cart {
            display: none;
          }

          .mobile-actions {
            display: flex;
          }

          .navbar-inner {
            min-height: 66px;
          }

        }


        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 575.98px) {

          .navbar-topbar {
            font-size: 10px;
            padding: 6px 0;
          }

          .topbar-divider {
            margin: 0 5px;
          }

          .navbar-inner {
            min-height: 62px;
          }

          .brand-icon {
            width: 37px;
            height: 37px;

            border-radius: 10px;

            font-size: 18px;
          }

          .brand-name {
            font-size: 16px;
          }

          .brand-tagline {
            font-size: 8px;
          }

          .mobile-cart,
          .mobile-menu-button {
            width: 38px;
            height: 38px;
          }

          .mobile-actions {
            gap: 5px;
          }

        }

      `}</style>
    </>
  );
}

export default Navbar;

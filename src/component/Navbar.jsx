import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const user = useSelector((state) => state.user?.currentUser);
  const count = useSelector((state) =>
    state.cart.items.reduce((s, i) => s + i.quantity, 0)
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          RaeesProduct
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" end to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Products
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center flex-column flex-lg-row gap-2 mt-2 mt-lg-0">
            <NavLink to="/cart" className="btn btn-primary ms-lg-3">
              🛒 Cart ({count})
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

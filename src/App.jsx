import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Home from "./pages/home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Contact from "./pages/Contact";

import AdminPanel from "./component/AddProduct";
import ProtectedRoute from "./component/ProtectedRoute";
import Login from "./pages/AdminLogin";

import Whatsapp from "./component/WhatsAppButton";
import { loginSuccess } from "./redux/userSlice";

/* ================= APP CONTENT ================= */
function AppContent() {
  const location = useLocation();

  // ❌ Pages where WhatsApp should NOT show
  const hideWhatsappRoutes = [
    "/checkout",
    "/admin",
    "/admin-login",
    "/order-success",
    "/contact",
  ];

  const shouldHideWhatsapp = hideWhatsappRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <Navbar />

      <main className="min-vh-100">
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* PRODUCTS */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* CONTACT */}
          <Route path="/contact" element={<Contact />} />

          {/* CART & CHECKOUT */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* ADMIN */}
          <Route path="/admin-login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* ✅ WhatsApp shows only on allowed pages */}
      {!shouldHideWhatsapp && <Whatsapp />}

      <Footer />
    </>
  );
}

/* ================= MAIN APP ================= */
function App() {
  const dispatch = useDispatch();

  // ✅ Auto admin login
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.role === "admin") {
        dispatch(loginSuccess({ id: payload.id, role: payload.role }));
      }
    } catch {
      localStorage.removeItem("adminToken");
    }
  }, [dispatch]);

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;

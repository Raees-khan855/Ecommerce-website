import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Home from "./pages/home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import AdminPanel from "./component/AddProduct";
import ProtectedRoute from "./component/ProtectedRoute";
import Login from "./pages/AdminLogin";
import Whatsapp from "./component/WhatsAppButton";
import { loginSuccess } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch();

  // ✅ Auto admin login (safe)
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.role === "admin") {
        dispatch(loginSuccess({ id: payload.id, role: payload.role }));
      }
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("adminToken");
    }
  }, [dispatch]);

  return (
    <HashRouter>
      <Navbar />

      {/* ✅ keeps footer at bottom */}
      <main className="min-vh-100">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Products */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Admin */}
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
      {/* ✅ WhatsApp Button goes HERE */}
      <Whatsapp />
      {/* ✅ Footer added correctly */}
      <Footer />
    </HashRouter>
  );
}

export default App;

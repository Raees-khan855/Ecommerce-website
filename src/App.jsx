import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Home from "./pages/home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./component/Navbar";
import AdminPanel from "./component/AddProduct";
import ProtectedRoute from "./component/ProtectedRoute";
import Login from "./pages/AdminLogin";
import { loginSuccess } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch(); // ✅ REQUIRED

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role === "admin") {
        dispatch(loginSuccess({ id: payload.id, role: payload.role }));
      }
    } catch {
      localStorage.removeItem("adminToken");
    }
  }, [dispatch]);

  return (
    <HashRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* products */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* cart */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* admin */}
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
    </HashRouter>
  );
}

export default App;

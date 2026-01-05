import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./component/Navbar";
import AdminPanel from "./component/AddProduct";
import ProtectedRoute from "./component/ProtectedRoute";
import Login from "./pages/AdminLogin";

function App() {
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
            path="/AdminPanel"
            element={
              <ProtectedRoute>
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

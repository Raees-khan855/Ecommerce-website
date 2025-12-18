import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./component/Navbar";
import AdminPanel from "./component/AddProduct";
import ProtectedRoute from "./component/ProtectedRoute";
import Login from "./pages/AdminLogin"; // your admin login page

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* admin login route */}
          <Route path="/admin-login" element={<Login />} />

          {/* protected admin panel */}
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
    </BrowserRouter>
  );
}

export default App;

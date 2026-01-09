import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../component/ProductCard";
import BACKEND_URL from "../config";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/products`);

        if (!isMounted) return;

        const productData = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];

        setProducts(productData);
      } catch (err) {
        console.error("Product fetch error:", err);
        if (isMounted) {
          setError("Unable to load products. Please try again later.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="container py-5 text-center">
        <h5 className="text-danger fw-semibold">{error}</h5>
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (products.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h5 className="text-muted">No products available.</h5>
      </div>
    );
  }

  /* ================= PRODUCTS ================= */
  return (
    <div className="container-xl py-4">
      {/* HEADER */}
      <div className="text-center mb-4 px-3">
        <h2 className="fw-bold">Our Products</h2>
      </div>

      {/* GRID */}
      <div className="row g-3">
        {products.map((p) => (
          <div
            key={p._id}
            className="
              col-6        /* Mobile */
              col-sm-6     /* Small phones */
              col-md-4     /* Tablets */
              col-lg-3     /* Laptops */
              col-xl-2     /* Large screens */
              d-flex
              justify-content-center
            "
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;

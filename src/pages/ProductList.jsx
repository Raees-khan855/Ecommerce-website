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

        // ✅ Safe API response handling
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <h5 className="text-danger fw-semibold">{error}</h5>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center mt-5">
        <h5 className="text-muted">No products available.</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      <div className="text-center py-3">
        <h2 className="fw-bold">Our Products</h2>
        <p className="text-muted">
          Browse durable products designed for real industrial use.
        </p>
      </div>

      <div className="row g-3 mx-0 px-2">
        {products.map((p) => (
          <div
            key={p._id}
            className="col-6 col-md-4 col-lg-3 d-flex justify-content-center"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;

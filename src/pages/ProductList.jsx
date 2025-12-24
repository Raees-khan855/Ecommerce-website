import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../component/ProductCard";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const res = await axios.get(
          "https://ecommerce-backend-q715w1ypy-raees-khan855s-projects.vercel.app/api/products"
        );
        if (mounted) setProducts(res.data || []);
      } catch (err) {
        if (mounted)
          setError("Unable to load products. Please try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();
    return () => (mounted = false);
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border" role="status"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-5">
        <h5 className="text-danger fw-semibold">{error}</h5>
      </div>
    );

  if (products.length === 0)
    return (
      <div className="text-center mt-5">
        <h5 className="text-muted">No products available.</h5>
      </div>
    );

  return (
    <div className="container-fluid px-0">
      {/* header */}
      <div className="text-center py-3">
        <h2 className="fw-bold">Our Products</h2>
        <p className="text-muted">
          Browse durable products designed for real industrial use.
        </p>
      </div>

      {/* grid */}
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

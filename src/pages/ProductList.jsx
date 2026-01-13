import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../component/ProductCard";
import BACKEND_URL from "../config";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // typing
  const [searchQuery, setSearchQuery] = useState(""); // actual search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BACKEND_URL}/products`, {
          params: {
            search: searchQuery || undefined,
          },
        });

        setProducts(res.data);
        setError(null);
      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]); // 🔥 ONLY when button clicked

  /* ================= SEARCH CLICK ================= */
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  /* ================= ENTER KEY SUPPORT ================= */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="container py-5 text-center">
        <h5 className="text-danger">{error}</h5>
      </div>
    );
  }

  /* ================= PRODUCTS ================= */
  return (
    <div className="container-xl py-4">
      {/* HEADER */}
      <div className="text-center mb-4 px-3">
        <h2 className="fw-bold">Our Products</h2>

        {/* 🔍 SEARCH BAR */}
        <div className="d-flex justify-content-center mt-3">
          <div className="input-group w-100 w-md-50">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button className="btn btn-primary" onClick={handleSearch}>
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {products.length === 0 && (
        <div className="text-center text-muted py-5">No products found.</div>
      )}

      {/* GRID */}
      <div className="row g-3">
        {products.map((p) => (
          <div
            key={p._id}
            className="
              col-6
              col-sm-6
              col-md-4
              col-lg-3
              col-xl-2
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

import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

/* 🔥 Lazy load ProductCard */
const ProductCard = lazy(() => import("../component/ProductCard"));

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BACKEND_URL}/products`, {
          params: searchQuery ? { search: searchQuery } : {},
        });

        if (mounted) {
          setProducts(Array.isArray(res.data) ? res.data : []);
          setError(null);
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        if (mounted) setError("Unable to load products.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => (mounted = false);
  }, [searchQuery]);

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  /* ================= UI ================= */
  return (
    <div className="container-xl py-4">
      {/* HEADER */}
      <div className="text-center mb-4 px-3">
        <h2 className="fw-bold">Our Products</h2>

        {/* SEARCH */}
        <div className="d-flex justify-content-center mt-3">
          <div className="input-group" style={{ maxWidth: 420 }}>
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

      {/* ERROR */}
      {error && <div className="text-center text-danger py-5">{error}</div>}

      {/* EMPTY */}
      {!loading && products.length === 0 && (
        <div className="text-center text-muted py-5">No products found.</div>
      )}

      {/* GRID */}
      <div className="row g-3">
        {(loading ? Array.from({ length: 12 }) : products).map((p, i) => (
          <div
            key={p?._id || i}
            className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex"
          >
            {loading ? (
              /* 🔥 Skeleton Card */
              <div className="card w-100 border-0 shadow-sm">
                <div className="bg-light" style={{ height: 180 }} />
                <div className="card-body">
                  <div className="placeholder-glow">
                    <span className="placeholder col-8"></span>
                    <span className="placeholder col-6"></span>
                  </div>
                </div>
              </div>
            ) : (
              <Suspense fallback={null}>
                <ProductCard product={p} />
              </Suspense>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;

import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import BACKEND_URL from "../config";

/* =========================
   Lazy Load ProductCard
========================= */
const ProductCard = lazy(() => import("../component/ProductCard"));

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  /* =========================
     CATEGORY TITLE
  ========================= */
  const categoryTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "All Products";

  /* =========================
     FETCH PRODUCTS
  ========================= */
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};

        if (category) {
          params.category = category.toLowerCase();
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        const res = await axios.get(`${BACKEND_URL}/products`, {
          params,
        });

        if (!mounted) return;

        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Product fetch error:", err);

        if (mounted) {
          setError("Unable to load products. Please try again.");
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [searchQuery, category]);

  /* =========================
     SEARCH
  ========================= */
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  /* =========================
     SKELETON
  ========================= */
  const SkeletonCard = () => {
    return (
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
        <div
          className="placeholder-glow bg-light"
          style={{
            height: "230px",
          }}
        >
          <span className="placeholder w-100 h-100"></span>
        </div>

        <div className="card-body p-3">
          <div className="placeholder-glow">
            <span className="placeholder col-9 mb-2"></span>
            <span className="placeholder col-5 mb-3"></span>
            <span className="placeholder col-7"></span>
          </div>
        </div>
      </div>
    );
  };

  /* =========================
     UI
  ========================= */
  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* =========================
          TOP HEADER
      ========================= */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
          color: "white",
        }}
      >
        <div className="container-xl">
          {/* Breadcrumb */}
          <div className="mb-3">
            <Link
              to="/"
              className="text-white text-decoration-none small opacity-75"
            >
              Home
            </Link>

            <span className="mx-2 opacity-50">/</span>

            <span className="small">{categoryTitle}</span>
          </div>

          <div className="row align-items-center g-4">
            {/* TITLE */}
            <div className="col-12 col-lg-5">
              <div>
                <span
                  className="badge rounded-pill px-3 py-2 mb-3"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(5px)",
                  }}
                >
                  🛍️ RaeesProduct
                </span>

                <h1 className="fw-bold display-6 mb-2">
                  {searchQuery
                    ? `Search results for "${searchQuery}"`
                    : category
                      ? `${categoryTitle}`
                      : "Discover Our Products"}
                </h1>

                <p
                  className="mb-0"
                  style={{
                    opacity: 0.85,
                    maxWidth: "500px",
                  }}
                >
                  Find quality products at great prices with fast delivery
                  across Pakistan.
                </p>
              </div>
            </div>

            {/* SEARCH */}
            <div className="col-12 col-lg-7">
              <div
                className="bg-white rounded-4 p-2 shadow-lg"
                style={{
                  maxWidth: "650px",
                  marginLeft: "auto",
                }}
              >
                <div className="input-group">
                  <span className="input-group-text bg-white border-0 ps-3">
                    🔍
                  </span>

                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search for watches, earbuds, electronics..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                      fontSize: "15px",
                    }}
                  />

                  {searchInput && (
                    <button
                      className="btn border-0 bg-white text-muted"
                      onClick={clearSearch}
                      type="button"
                    >
                      ✕
                    </button>
                  )}

                  <button
                    className="btn btn-primary rounded-3 px-4"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          TRUST BAR
      ========================= */}
      <section className="bg-white border-bottom">
        <div className="container-xl">
          <div className="row g-0">
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-2 py-3">
                <span className="fs-4">🚚</span>
                <div>
                  <div className="fw-bold small">Fast Delivery</div>
                  <div className="text-muted" style={{ fontSize: "11px" }}>
                    Across Pakistan
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-2 py-3">
                <span className="fs-4">💵</span>
                <div>
                  <div className="fw-bold small">Cash on Delivery</div>
                  <div className="text-muted" style={{ fontSize: "11px" }}>
                    Pay when received
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-2 py-3">
                <span className="fs-4">🛡️</span>
                <div>
                  <div className="fw-bold small">Quality Products</div>
                  <div className="text-muted" style={{ fontSize: "11px" }}>
                    Carefully selected
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-2 py-3">
                <span className="fs-4">💬</span>
                <div>
                  <div className="fw-bold small">Customer Support</div>
                  <div className="text-muted" style={{ fontSize: "11px" }}>
                    We're here to help
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="container-xl py-4">
        {/* =========================
            CATEGORY CHIPS
        ========================= */}
        <div className="d-flex align-items-center gap-2 mb-4 overflow-auto pb-2">
          <Link
            to="/products"
            className={`btn rounded-pill px-4 ${
              !category ? "btn-primary" : "btn-outline-secondary"
            }`}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            All Products
          </Link>

          <Link
            to="/products?category=watch"
            className={`btn rounded-pill px-4 ${
              category === "watch" ? "btn-primary" : "btn-outline-secondary"
            }`}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            ⌚ Watches
          </Link>

          <Link
            to="/products?category=earbuds"
            className={`btn rounded-pill px-4 ${
              category === "earbuds" ? "btn-primary" : "btn-outline-secondary"
            }`}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            🎧 Earbuds
          </Link>

          <Link
            to="/products?category=beauty"
            className={`btn rounded-pill px-4 ${
              category === "beauty" ? "btn-primary" : "btn-outline-secondary"
            }`}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            💄 Beauty
          </Link>

          <Link
            to="/products?category=electronics"
            className={`btn rounded-pill px-4 ${
              category === "electronics"
                ? "btn-primary"
                : "btn-outline-secondary"
            }`}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            🔌 Electronics
          </Link>
        </div>

        {/* =========================
            RESULTS HEADER
        ========================= */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold mb-1">
              {searchQuery
                ? "Search Results"
                : category
                  ? `${categoryTitle} Collection`
                  : "All Products"}
            </h3>

            {!loading && !error && (
              <p className="text-muted small mb-0">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} available
              </p>
            )}
          </div>

          {searchQuery && (
            <button
              className="btn btn-outline-secondary rounded-pill px-3"
              onClick={clearSearch}
            >
              Clear Search ✕
            </button>
          )}
        </div>

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="py-5">
            <div
              className="card border-0 shadow-sm rounded-4 text-center mx-auto"
              style={{ maxWidth: "550px" }}
            >
              <div className="card-body p-5">
                <div className="display-3 mb-3">⚠️</div>

                <h4 className="fw-bold">Something went wrong</h4>

                <p className="text-muted mb-4">{error}</p>

                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}
        {!loading && !error && products.length === 0 && (
          <div className="py-5">
            <div
              className="card border-0 shadow-sm rounded-4 text-center mx-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="card-body p-5">
                <div className="display-2 mb-3">🔎</div>

                <h3 className="fw-bold">No products found</h3>

                <p className="text-muted mb-4">
                  We couldn't find any products matching your search. Try
                  another keyword or browse all products.
                </p>

                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={clearSearch}
                >
                  View All Products
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            PRODUCT GRID
        ========================= */}
        {(loading || products.length > 0) && (
          <div className="row g-3 g-md-4">
            {(loading ? Array.from({ length: 12 }) : products).map(
              (product, index) => (
                <div
                  key={product?._id || index}
                  className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3"
                >
                  {loading ? (
                    <SkeletonCard />
                  ) : (
                    <Suspense fallback={<SkeletonCard />}>
                      <ProductCard product={product} />
                    </Suspense>
                  )}
                </div>
              ),
            )}
          </div>
        )}

        {/* =========================
            BOTTOM TRUST SECTION
        ========================= */}
        {!loading && products.length > 0 && (
          <section className="mt-5">
            <div
              className="rounded-4 p-4 p-md-5 text-center"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f1f5ff 100%)",
                border: "1px solid #e9ecef",
              }}
            >
              <div className="fs-1 mb-2">🛍️</div>

              <h4 className="fw-bold">Shop with confidence</h4>

              <p
                className="text-muted mb-0 mx-auto"
                style={{ maxWidth: "650px" }}
              >
                Enjoy quality products, fast delivery, Cash on Delivery and
                reliable customer support from RaeesProduct.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ProductList;

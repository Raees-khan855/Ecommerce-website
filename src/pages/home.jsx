import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../config";
import useSEO from "../hooks/useSEO";

/* 🔥 reuse same card everywhere */
const ProductCard = lazy(() => import("../component/ProductCard"));

function Home() {
  /* ================= SEO ================= */
  useSEO({
    title: "RaeesProduct",
    description:
      "Buy quality products online with fast delivery and Cash on Delivery all over Pakistan.",
    keywords: "online shopping Pakistan, ecommerce store, COD shopping",
    url: window.location.href,
    image: "https://yourdomain.com/seo/home.jpg",
  });

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [heroRes, productRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/hero`),
          axios.get(`${BACKEND_URL}/products/featured/all`),
        ]);

        if (!mounted) return;

        setHero(heroRes.data || null);
        setFeaturedProducts(
          Array.isArray(productRes.data) ? productRes.data : [],
        );
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  /* ================= HERO IMAGE ================= */
  const heroImg = hero?.image
    ? hero.image.startsWith("http")
      ? hero.image
      : `${BACKEND_URL}/${hero.image.replace(/^\/+/, "")}`
    : "https://images.unsplash.com/photo-1616627982421-74db63b3f8a0?auto=format&fit=crop&w=1470&q=80";

  /* ================= UI ================= */
  return (
    <div className="container-fluid px-0">
      {/* ================= HERO ================= */}
      <section
        className="position-relative text-center text-white d-flex align-items-center"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "40vh",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.6)" }}
        />

        <div className="container position-relative z-1 py-5">
          <h1 className="fw-bold display-5">
            {hero?.title || "Welcome to RaeesProduct"}
          </h1>

          <p className="fs-6 mx-auto" style={{ maxWidth: 720 }}>
            {hero?.subtitle ||
              "Shop with free delivery and cash on delivery—pay when your order arrives."}
          </p>

          <Link to="/products" className="btn btn-light btn-lg mt-3 px-4">
            🛍️ Shop Now
          </Link>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <div className="container my-5">
        <h2 className="fw-bold text-center mb-4">Featured Products</h2>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : featuredProducts.length === 0 ? (
          <p className="text-center text-muted">No featured products yet.</p>
        ) : (
          <div className="row g-3">
            {featuredProducts.map((p) => (
              <div key={p._id} className="col-6 col-md-4 col-lg-3">
                <Suspense fallback={null}>
                  {/* 🔥 same card component */}
                  <ProductCard product={p} />
                </Suspense>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= INFO ================= */}
      <section className="bg-light py-5 mt-5">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Why Choose RaeesProduct?</h3>

          <p className="mb-0 fs-6">
            ✔ Newly launched quality products <br />
            ✔ Cash on Delivery available all over Pakistan <br />
            ✔ Fast & FREE shipping nationwide <br />
            ✔ Reliable customer support <br />✔ 100% satisfaction guaranteed
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;

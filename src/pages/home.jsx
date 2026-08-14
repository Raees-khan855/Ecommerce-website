import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../config";
import useSEO from "../hooks/useSEO";
import { optimizeCloudinary } from "../utils/cloudinary";

/* 🔥 Reuse same card everywhere */
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
      ? optimizeCloudinary(hero.image, 900) // width 900px for hero
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

      {/* ================= TRUST FEATURES ================= */}
      <section className="py-4 bg-white">
        <div className="container">
          <div className="row g-3 justify-content-center">
            {/* Fast Delivery */}
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 text-center p-3">
                <div className="fs-1 mb-2">🚚</div>
                <h6 className="fw-bold mb-1">Fast Delivery</h6>
                <p className="text-muted small mb-0">
                  Quick delivery across Pakistan
                </p>
              </div>
            </div>

            {/* Cash on Delivery */}
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 text-center p-3">
                <div className="fs-1 mb-2">💵</div>
                <h6 className="fw-bold mb-1">Cash on Delivery</h6>
                <p className="text-muted small mb-0">
                  Pay when your order arrives
                </p>
              </div>
            </div>

            {/* Quality Products */}
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 text-center p-3">
                <div className="fs-1 mb-2">🛡️</div>
                <h6 className="fw-bold mb-1">Quality Products</h6>
                <p className="text-muted small mb-0">
                  Products selected with care
                </p>
              </div>
            </div>

            {/* Customer Support */}
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 text-center p-3">
                <div className="fs-1 mb-2">💬</div>
                <h6 className="fw-bold mb-1">Customer Support</h6>
                <p className="text-muted small mb-0">We're here to help you</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= SHOP BY CATEGORY ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Shop by Category</h2>

          <div className="row g-3">
            {/* WATCHES */}
            <div className="col-6 col-md-3">
              <Link
                to="/products?category=watch"
                className="text-decoration-none text-dark"
              >
                <div className="card border-0 shadow-sm h-100 text-center p-4">
                  <div className="fs-1 mb-2">⌚</div>

                  <h5 className="fw-bold mb-1">Watches</h5>

                  <p className="text-muted small mb-0">Explore Watches</p>
                </div>
              </Link>
            </div>

            {/* EARBUDS */}
            <div className="col-6 col-md-3">
              <Link
                to="/products?category=earbuds"
                className="text-decoration-none text-dark"
              >
                <div className="card border-0 shadow-sm h-100 text-center p-4">
                  <div className="fs-1 mb-2">🎧</div>

                  <h5 className="fw-bold mb-1">Earbuds</h5>

                  <p className="text-muted small mb-0">Explore Earbuds</p>
                </div>
              </Link>
            </div>

            {/* BEAUTY */}
            <div className="col-6 col-md-3">
              <Link
                to="/products?category=beauty"
                className="text-decoration-none text-dark"
              >
                <div className="card border-0 shadow-sm h-100 text-center p-4">
                  <div className="fs-1 mb-2">💄</div>

                  <h5 className="fw-bold mb-1">Beauty</h5>

                  <p className="text-muted small mb-0">Explore Beauty</p>
                </div>
              </Link>
            </div>

            {/* ELECTRONICS */}
            <div className="col-6 col-md-3">
              <Link
                to="/products?category=electronics"
                className="text-decoration-none text-dark"
              >
                <div className="card border-0 shadow-sm h-100 text-center p-4">
                  <div className="fs-1 mb-2">🛍️</div>

                  <h5 className="fw-bold mb-1">Electronics</h5>

                  <p className="text-muted small mb-0">Explore Electronics</p>
                </div>
              </Link>
            </div>
          </div>
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
      {/* ================= NEED HELP ================= */}
      <section className="py-5">
        <div className="container">
          <div className="card border-0 shadow-sm text-center p-4">
            <h4 className="fw-bold mb-2">💬 NEED HELP?</h4>

            <p className="text-muted mb-3">
              Have a question about a product or your order?
            </p>

            <a
              href="https://wa.me/923004555681"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success px-4 py-2 fw-semibold"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
      {/* ================= LOCATION MAP ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-2">Find Us</h2>

          <p className="text-muted text-center mb-4">
            Visit our location or find us on the map
          </p>

          <div
            className="rounded-4 overflow-hidden shadow-sm"
            style={{ height: "400px", width: "100%" }}
          >
            <iframe
              title="RaeesProduct Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.2284920206175!2d71.57255387403798!3d34.01234541983877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d93d7cdf45d3af%3A0xb0e53be8bb12f001!2sAshraf%20Rd%2C%20Hashtnagri%2C%20Peshawar%2C%20Pakistan!5e0!3m2!1sen!2s!4v1786474294146!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

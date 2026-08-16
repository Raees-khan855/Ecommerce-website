import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../config";
import useSEO from "../hooks/useSEO";
import { optimizeCloudinary } from "../utils/cloudinary";

const ProductCard = lazy(() => import("../component/ProductCard"));

function Home() {
  /* ================= SEO ================= */
  useSEO({
    title: "RaeesProduct | Shop Quality Products Online",
    description:
      "Shop quality products online with fast delivery and Cash on Delivery across Pakistan.",
    keywords:
      "online shopping Pakistan, ecommerce store, COD shopping, watches, earbuds, electronics",
    url: window.location.href,
    image: "https://yourdomain.com/seo/home.jpg",
  });

  /* ================= STATE ================= */
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
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  /* ================= HERO IMAGE ================= */
  const heroImg = hero?.image
    ? hero.image.startsWith("http")
      ? optimizeCloudinary(hero.image, 1200)
      : `${BACKEND_URL}/${hero.image.replace(/^\/+/, "")}`
    : "https://images.unsplash.com/photo-1616627982421-74db63b3f8a0?auto=format&fit=crop&w=1470&q=80";

  /* ================= CATEGORIES ================= */
  const categories = [
    {
      name: "Watches",
      subtitle: "Classic & modern",
      icon: "⌚",
      link: "/products?category=watch",
    },
    {
      name: "Earbuds",
      subtitle: "Wireless audio",
      icon: "🎧",
      link: "/products?category=earbuds",
    },
    {
      name: "Beauty",
      subtitle: "Beauty essentials",
      icon: "💄",
      link: "/products?category=beauty",
    },
    {
      name: "Electronics",
      subtitle: "Smart technology",
      icon: "⚡",
      link: "/products?category=electronics",
    },
  ];

  /* ================= UI ================= */
  return (
    <div className="bg-white">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="position-relative overflow-hidden"
        style={{
          minHeight: "520px",
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,.78), rgba(0,0,0,.38), rgba(0,0,0,.15))",
          }}
        />

        <div
          className="container position-relative d-flex align-items-center"
          style={{ minHeight: "520px" }}
        >
          <div
            className="text-white"
            style={{
              maxWidth: "700px",
            }}
          >
            {/* Small badge */}
            <div className="mb-3">
              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  background: "rgba(255,255,255,.15)",
                  border: "1px solid rgba(255,255,255,.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                🇵🇰 Trusted Online Shopping
              </span>
            </div>

            <h1
              className="fw-bold display-3 mb-3"
              style={{
                lineHeight: "1.05",
                letterSpacing: "-1px",
              }}
            >
              {hero?.title || "Shop Smarter. Live Better."}
            </h1>

            <p
              className="lead mb-4"
              style={{
                maxWidth: "600px",
                color: "rgba(255,255,255,.9)",
              }}
            >
              {hero?.subtitle ||
                "Discover quality products, great prices and convenient Cash on Delivery across Pakistan."}
            </p>

            <div className="d-flex flex-wrap gap-3">
              <Link
                to="/products"
                className="btn btn-light btn-lg rounded-pill px-4 fw-semibold shadow"
              >
                🛍️ Shop Now
              </Link>

              <a
                href="#products"
                className="btn btn-outline-light btn-lg rounded-pill px-4 fw-semibold"
              >
                Explore Products
              </a>
            </div>

            {/* Hero mini benefits */}
            <div className="d-flex flex-wrap gap-4 mt-4 small">
              <span>✓ Cash on Delivery</span>
              <span>✓ Fast Delivery</span>
              <span>✓ Quality Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST BAR
      ====================================================== */}
      <section
        className="border-bottom"
        style={{
          background: "#fff",
        }}
      >
        <div className="container py-4">
          <div className="row g-3">
            <div className="col-6 col-lg-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#eef6ff",
                    fontSize: "23px",
                  }}
                >
                  🚚
                </div>

                <div>
                  <div className="fw-bold small">Fast Delivery</div>
                  <div className="text-muted small">Across Pakistan</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#effaf2",
                    fontSize: "23px",
                  }}
                >
                  💵
                </div>

                <div>
                  <div className="fw-bold small">Cash on Delivery</div>
                  <div className="text-muted small">Pay when delivered</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#fff7e8",
                    fontSize: "23px",
                  }}
                >
                  🛡️
                </div>

                <div>
                  <div className="fw-bold small">Quality Products</div>
                  <div className="text-muted small">Selected with care</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#f5efff",
                    fontSize: "23px",
                  }}
                >
                  💬
                </div>

                <div>
                  <div className="fw-bold small">Customer Support</div>
                  <div className="text-muted small">We're here to help</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-primary fw-semibold small">
                SHOP COLLECTIONS
              </span>

              <h2 className="fw-bold mb-1 mt-1">Shop by Category</h2>

              <p className="text-muted mb-0">Find what you're looking for</p>
            </div>

            <Link
              to="/products"
              className="text-decoration-none fw-semibold d-none d-md-block"
            >
              View All →
            </Link>
          </div>

          <div className="row g-3">
            {categories.map((category) => (
              <div className="col-6 col-lg-3" key={category.name}>
                <Link
                  to={category.link}
                  className="text-decoration-none text-dark"
                >
                  <div
                    className="rounded-4 p-4 h-100 text-center"
                    style={{
                      background: "#f8f9fa",
                      border: "1px solid #eeeeee",
                      transition: "all .25s ease",
                    }}
                  >
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "75px",
                        height: "75px",
                        background: "#fff",
                        fontSize: "36px",
                        boxShadow: "0 5px 20px rgba(0,0,0,.06)",
                      }}
                    >
                      {category.icon}
                    </div>

                    <h5 className="fw-bold mb-1">{category.name}</h5>

                    <p className="text-muted small mb-0">{category.subtitle}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-4 d-md-none">
            <Link
              to="/products"
              className="btn btn-outline-dark rounded-pill px-4"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}
      <section
        id="featured"
        className="py-5"
        style={{
          background: "#f8f9fa",
        }}
      >
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold small">
              OUR BEST PICKS
            </span>

            <h2 className="fw-bold mt-1 mb-2">Featured Products</h2>

            <p className="text-muted mb-0">
              Discover some of our most popular products
            </p>
          </div>

          {loading ? (
            <div className="row g-3">
              {[1, 2, 3, 4].map((item) => (
                <div className="col-6 col-md-4 col-lg-3" key={item}>
                  <div
                    className="bg-white rounded-4"
                    style={{
                      height: "360px",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "50px" }}>🛍️</div>

              <h5 className="fw-bold mt-3">No featured products yet</h5>

              <p className="text-muted">
                Check back soon for our latest products.
              </p>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {featuredProducts.map((product) => (
                  <div key={product._id} className="col-6 col-md-4 col-lg-3">
                    <Suspense fallback={null}>
                      <ProductCard product={product} />
                    </Suspense>
                  </div>
                ))}
              </div>

              <div className="text-center mt-5">
                <Link
                  to="/products"
                  className="btn btn-dark rounded-pill px-5 py-2 fw-semibold"
                >
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ====================================================== */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="text-primary fw-semibold small">
                WHY RAEESPRODUCT?
              </span>

              <h2 className="fw-bold display-6 mt-2">
                Shopping made simple and reliable.
              </h2>

              <p className="text-muted mt-3">
                We focus on providing quality products, convenient shopping and
                reliable delivery so you can order with confidence.
              </p>

              <div className="mt-4">
                <div className="d-flex gap-3 mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "#eef6ff",
                    }}
                  >
                    ✓
                  </div>

                  <div>
                    <h6 className="fw-bold mb-1">Quality products</h6>

                    <p className="text-muted small mb-0">
                      Products selected with care for our customers.
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-3 mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "#effaf2",
                    }}
                  >
                    ✓
                  </div>

                  <div>
                    <h6 className="fw-bold mb-1">Cash on Delivery</h6>

                    <p className="text-muted small mb-0">
                      Pay when your order arrives at your door.
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "#fff7e8",
                    }}
                  >
                    ✓
                  </div>

                  <div>
                    <h6 className="fw-bold mb-1">Customer support</h6>

                    <p className="text-muted small mb-0">
                      Have a question? We're here to help.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/products"
                className="btn btn-primary rounded-pill px-4 mt-4"
              >
                Start Shopping →
              </Link>
            </div>

            <div className="col-lg-6">
              <div
                className="rounded-4 p-4 p-md-5"
                style={{
                  background: "linear-gradient(135deg, #f1f6ff, #f8f9fa)",
                }}
              >
                <div className="row g-3">
                  <div className="col-6">
                    <div className="bg-white rounded-4 p-4 text-center shadow-sm">
                      <div className="fs-1">🚚</div>
                      <h5 className="fw-bold mt-2 mb-1">3–5 Days</h5>
                      <p className="text-muted small mb-0">Delivery</p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="bg-white rounded-4 p-4 text-center shadow-sm">
                      <div className="fs-1">💵</div>
                      <h5 className="fw-bold mt-2 mb-1">COD</h5>
                      <p className="text-muted small mb-0">Payment</p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="bg-white rounded-4 p-4 text-center shadow-sm">
                      <div className="fs-1">🛡️</div>
                      <h5 className="fw-bold mt-2 mb-1">Trusted</h5>
                      <p className="text-muted small mb-0">Shopping</p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="bg-white rounded-4 p-4 text-center shadow-sm">
                      <div className="fs-1">💬</div>
                      <h5 className="fw-bold mt-2 mb-1">Support</h5>
                      <p className="text-muted small mb-0">Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HELP / WHATSAPP
      ====================================================== */}
      <section className="py-5">
        <div className="container">
          <div
            className="rounded-4 text-white p-4 p-md-5 text-center"
            style={{
              background: "linear-gradient(135deg, #111827, #1f2937)",
            }}
          >
            <div style={{ fontSize: "40px" }}>💬</div>

            <h3 className="fw-bold mt-2">Need help before ordering?</h3>

            <p className="mb-4" style={{ color: "rgba(255,255,255,.7)" }}>
              Ask us about products, delivery or your order.
            </p>

            <a
              href="https://wa.me/923004555681"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success rounded-pill px-4 py-2 fw-semibold"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          LOCATION
      ====================================================== */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <span className="text-primary fw-semibold small">OUR LOCATION</span>

            <h2 className="fw-bold mt-1">Find Us</h2>

            <p className="text-muted mb-0">
              Visit our location or find us on the map.
            </p>
          </div>

          <div
            className="rounded-4 overflow-hidden shadow-sm"
            style={{
              height: "400px",
              width: "100%",
            }}
          >
            <iframe
              title="RaeesProduct Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.2284920206175!2d71.57255387403798!3d34.01234541983877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d93d7cdf45d3af%3A0xb0e53be8bb12f001!2sAshraf%20Rd%2C%20Hashtnagri%2C%20Peshawar%2C%20Pakistan!5e0!3m2!1sen!2s!4v1786474294146!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{
                border: 0,
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold">Ready to find your next product?</h2>

          <p className="text-muted mb-4">
            Explore our collection and order today.
          </p>

          <Link
            to="/products"
            className="btn btn-primary btn-lg rounded-pill px-5"
          >
            🛍️ Shop Now
          </Link>
        </div>
      </section>

      {/* =====================================================
          ANIMATION
      ====================================================== */}
      <style>
        {`
          @keyframes pulse {
            0% {
              opacity: 1;
            }

            50% {
              opacity: .55;
            }

            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;

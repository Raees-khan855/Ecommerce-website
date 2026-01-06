import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import axios from "axios";
import BACKEND_URL from "../config";

function Home() {
  const dispatch = useDispatch();
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

        if (mounted) {
          setHero(heroRes.data || null);
          setFeaturedProducts(
            Array.isArray(productRes.data) ? productRes.data : []
          );
        }
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  /* ================= IMAGE HELPERS ================= */
  const heroImg = hero?.image
    ? hero.image.startsWith("http")
      ? hero.image
      : `${BACKEND_URL}/${hero.image.replace(/^\/+/, "")}`
    : "https://images.unsplash.com/photo-1616627982421-74db63b3f8a0?auto=format&fit=crop&w=1470&q=80";

  const getProductImg = (img) =>
    img
      ? img.startsWith("http")
        ? img
        : `${BACKEND_URL}/${img.replace(/^\/+/, "")}`
      : "https://via.placeholder.com/300?text=No+Image";

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
          minHeight: "70vh",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.6)" }}
        />

        <div className="container position-relative z-1 py-5">
          <h1 className="fw-bold display-5 display-md-4">
            {hero?.title || "Welcome to RaeesProduct"}
          </h1>
          <p className="fs-6 fs-md-5 mx-auto" style={{ maxWidth: "720px" }}>
            {hero?.subtitle ||
              "Your trusted source for industrial and chemical containers."}
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
              <div
                key={p._id}
                className="col-6 col-sm-6 col-md-4 col-lg-3 d-flex"
              >
                <div className="card h-100 shadow-sm border-0 rounded-3 w-100">
                  {/* Image */}
                  <div
                    className="bg-light d-flex align-items-center justify-content-center p-3"
                    style={{ height: "200px" }}
                  >
                    <img
                      src={getProductImg(p.image)}
                      alt={p.title}
                      className="img-fluid"
                      style={{ maxHeight: "100%", objectFit: "contain" }}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/300?text=No+Image")
                      }
                    />
                  </div>

                  {/* Content */}
                  <div className="card-body d-flex flex-column text-center">
                    <h6 className="fw-semibold text-truncate">{p.title}</h6>
                    <span className="fw-bold mb-3">
                      ${Number(p.price).toFixed(2)}
                    </span>

                    <div className="mt-auto d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-outline-primary btn-sm flex-grow-1"
                        onClick={() =>
                          dispatch(
                            addToCart({
                              id: p._id,
                              title: p.title,
                              price: Number(p.price),
                              image: getProductImg(p.image),
                            })
                          )
                        }
                      >
                        Add
                      </button>
                      <Link
                        to={`/products/${p._id}`}
                        className="btn btn-primary btn-sm flex-grow-1"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
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
            ✔ Durable HDPE materials — built to last <br />
            ✔ Fast nationwide shipping <br />
            ✔ 24/7 customer support <br />✔ Secure payments
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;

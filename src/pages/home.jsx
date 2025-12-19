import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import axios from "axios";

function Home() {
  const dispatch = useDispatch();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchHero = async () => {
      try {
        const res = await axios.get(
          "https://ecommerce-backend--inforaees690809.replit.app/api/hero"
        );
        if (mounted) setHero(res.data);
      } catch (err) {
        console.error("Hero fetch error:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://ecommerce-backend--inforaees690809.replit.app/api/products/featured/all"
        );
        if (mounted) setFeaturedProducts(res.data || []);
      } catch (err) {
        console.error("Featured fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
    fetchProducts();

    return () => (mounted = false);
  }, []);

  // Determine hero image URL
  const heroImg = hero?.image
    ? hero.image.startsWith("http")
      ? hero.image
      : `https://ecommerce-backend--inforaees690809.replit.app${hero.image}`
    : "https://images.unsplash.com/photo-1616627982421-74db63b3f8a0?auto=format&fit=crop&w=1470&q=80";

  return (
    <div className="container my-5">
      {/* 🌟 Hero Section */}
      <section
        className="position-relative text-center text-white rounded-3 shadow-sm mb-5"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.55)", borderRadius: "0.5rem" }}
        ></div>

        <div className="position-relative w-100" style={{ zIndex: 2 }}>
          <h1 className="display-4 fw-bold">
            {hero?.title || "Welcome to RaeesProduct"}
          </h1>
          <p className="mx-auto fs-5" style={{ maxWidth: "700px" }}>
            {hero?.subtitle ||
              "Your trusted source for industrial and chemical containers."}
          </p>
          <Link to="/products" className="btn btn-light btn-lg mt-3">
            🛍️ Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <h2 className="mb-4 text-center fw-bold">Featured Products</h2>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : featuredProducts.length === 0 ? (
        <p className="text-center text-muted">No featured products yet.</p>
      ) : (
        <div className="row g-4">
          {featuredProducts.map((p) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
              key={p._id}
            >
              <div className="card h-100 shadow-sm border-0 rounded-3">
                <div
                  className="text-center bg-light p-3"
                  style={{ height: "220px" }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="img-fluid h-100"
                    style={{ objectFit: "contain" }}
                  />
                </div>

                <div className="card-body d-flex flex-column text-center">
                  <h6 className="fw-semibold text-truncate">{p.title}</h6>
                  <p className="fw-bold">${Number(p.price).toFixed(2)}</p>

                  <div className="mt-auto d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => dispatch(addToCart(p))}
                    >
                      Add
                    </button>
                    <Link
                      to={`/products/${p._id}`}
                      className="btn btn-primary btn-sm"
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

      {/* Info Section */}
      <section
        className="mt-5 p-5 rounded shadow-sm text-center"
        style={{ backgroundColor: "#f0f2f5" }}
      >
        <h3 className="fw-bold">Why Choose RaeesProduct?</h3>
        <p className="mt-3 mb-0 fs-6">
          ✔ Durable HDPE materials — built to last <br />
          ✔ Fast nationwide shipping <br />
          ✔ 24/7 customer support <br />✔ Secure payments
        </p>
      </section>
    </div>
  );
}

export default Home;

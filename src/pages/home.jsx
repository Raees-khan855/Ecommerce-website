import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import axios from "axios";
import BACKEND_URL from "../config";
import useSEO from "../hooks/useSEO";

function Home() {
  useSEO({
    title: "RaeesProduct",
    description:
      "Buy quality products online with fast delivery and Cash on Delivery all over Pakistan.",
    keywords: "online shopping Pakistan, ecommerce store, COD shopping",
    url: window.location.href,
  });

  const dispatch = useDispatch();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [hero, setHero] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [heroRes, productRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/hero`),
          axios.get(`${BACKEND_URL}/products/featured/all`),
        ]);

        if (mounted) {
          setHero(heroRes.data || null);
          setFeaturedProducts(
            Array.isArray(productRes.data) ? productRes.data : [],
          );
        }
      } catch (err) {
        console.error("Home fetch error:", err);
      }
    })();

    return () => (mounted = false);
  }, []);

  /* ================= IMAGE HELPERS ================= */
  const getProductImage = (p) => {
    const img = p.mainImage || p.images?.[0];
    if (!img) return "https://via.placeholder.com/300?text=No+Image";
    return img.startsWith("http")
      ? img
      : `${BACKEND_URL}/${img.replace(/^\/+/, "")}`;
  };

  const heroImg = hero?.image
    ? hero.image.startsWith("http")
      ? hero.image
      : `${BACKEND_URL}/${hero.image.replace(/^\/+/, "")}`
    : "https://via.placeholder.com/1200x500?text=Welcome";

  /* ================= UI ================= */
  return (
    <>
      {/* ================= HERO (LCP OPTIMIZED) ================= */}
      <section className="position-relative overflow-hidden">
        <img
          src={heroImg}
          alt={hero?.title || "RaeesProduct"}
          width="1200"
          height="500"
          fetchpriority="high"
          className="w-100"
          style={{ objectFit: "cover", maxHeight: "420px" }}
        />

        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <div className="container text-white text-center">
            <h1 className="fw-bold display-6">
              {hero?.title || "Welcome to RaeesProduct"}
            </h1>

            <p className="fs-6 mx-auto" style={{ maxWidth: 720 }}>
              {hero?.subtitle ||
                "Shop with free delivery and cash on delivery—pay when your order arrives."}
            </p>

            <Link to="/products" className="btn btn-light btn-lg mt-2 px-4">
              🛍️ Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <div className="container my-5">
        <h2 className="fw-bold text-center mb-4">Featured Products</h2>

        <div className="row g-3">
          {featuredProducts.map((p) => (
            <div key={p._id} className="col-6 col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: 180 }}
                >
                  <img
                    src={getProductImage(p)}
                    alt={p.title}
                    width="160"
                    height="160"
                    loading="lazy"
                    style={{ objectFit: "contain" }}
                  />
                </div>

                <div className="card-body text-center d-flex flex-column">
                  <h6 className="fw-semibold text-truncate">{p.title}</h6>

                  <span className="fw-bold mb-2">
                    Rs.{Number(p.price).toFixed(2)}
                  </span>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm w-50"
                      onClick={() =>
                        dispatch(
                          addToCart({
                            id: p._id,
                            title: p.title,
                            price: Number(p.price),
                            image: getProductImage(p),
                          }),
                        )
                      }
                    >
                      Add
                    </button>

                    <Link
                      to={`/products/${p._id}`}
                      className="btn btn-primary btn-sm w-50"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= INFO ================= */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Why Choose RaeesProduct?</h3>
          <p className="mb-0 fs-6">
            ✔ Quality products <br />
            ✔ Cash on Delivery across Pakistan <br />
            ✔ Fast & FREE shipping <br />✔ Trusted customer support
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;

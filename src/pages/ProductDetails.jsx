import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import BACKEND_URL from "../config";
import useSEO from "../hooks/useSEO";

import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShareAlt,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";

/* 🔥 Lazy load related cards */
const ProductCard = lazy(() => import("../component/ProductCard"));

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const rating = 4.6;
  const reviewCount = 128;

  /* ================= SEO ================= */
  useSEO({
    title: product ? `${product.title} | RaeesProduct` : "Product Details",
    description: product?.description || "",
    image: product?.image || "",
    url: window.location.href,
  });

  /* ================= SCROLL ================= */
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  /* ================= FETCH ================= */
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/products/${id}`);
        if (!mounted) return;

        const prod = res.data.product || res.data;

        setProduct(prod);
        setRelated(Array.isArray(res.data.related) ? res.data.related : []);

        setActiveImage(
          Array.isArray(prod.images) && prod.images.length > 0
            ? prod.images[0]
            : prod.image || null,
        );
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => (mounted = false);
  }, [id]);

  /* ================= HELPERS ================= */
  const getImageUrl = (img) =>
    img
      ? img.startsWith("http")
        ? img
        : `${BACKEND_URL}/${img.replace(/^\/+/, "")}`
      : "https://via.placeholder.com/400?text=No+Image";

  const images =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : [];

  const mainImage = getImageUrl(activeImage);
  const price = Number(product?.price || 0).toFixed(2);

  /* ================= CART ================= */
  const addItem = (checkout = false) => {
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: Number(product.price || 0),
        image: mainImage,
        quantity,
      }),
    );

    navigate(checkout ? "/checkout" : "/cart");
  };

  /* ================= SHARE FIX (ONLY FOR THIS PAGE) ================= */

  const productUrl = window.location.href;

  const handleWhatsAppShare = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(productUrl)}`,
      "_blank",
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      alert("Link copied!");
    } catch {
      alert("Copy failed");
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return handleWhatsAppShare();

    try {
      await navigator.share({
        title: product.title,
        url: productUrl,
      });
    } catch {}
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="bg-light rounded" style={{ height: 420 }} />
          </div>
          <div className="col-md-6">
            <div className="placeholder-glow">
              <span className="placeholder col-6 mb-2" />
              <span className="placeholder col-4 mb-3" />
              <span className="placeholder col-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <h4 className="text-center mt-5 text-danger">Product not found</h4>;
  }

  /* ================= UI ================= */
  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* IMAGE */}
        <div className="col-12 col-md-6">
          <div className="bg-light p-3 rounded shadow-sm text-center">
            <img
              src={mainImage}
              alt={product.title}
              loading="eager"
              width="420"
              height="420"
              className="img-fluid mb-3"
              style={{ objectFit: "contain" }}
            />

            {images.length > 1 && (
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={getImageUrl(img)}
                    width="64"
                    height="64"
                    alt="thumb"
                    onClick={() => setActiveImage(img)}
                    style={{
                      cursor: "pointer",
                      objectFit: "cover",
                      border:
                        img === activeImage
                          ? "2px solid #0d6efd"
                          : "1px solid #ddd",
                      borderRadius: 6,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="col-12 col-md-6">
          <h2 className="fw-bold">{product.title}</h2>

          {/* RATING */}
          <div className="d-flex align-items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) =>
              rating >= i ? (
                <FaStar key={i} className="text-warning" />
              ) : rating >= i - 0.5 ? (
                <FaStarHalfAlt key={i} className="text-warning" />
              ) : (
                <FaRegStar key={i} className="text-warning" />
              ),
            )}
            <span className="small text-muted ms-2">
              {rating} ({reviewCount})
            </span>
          </div>

          <h4 className="text-primary fw-bold mb-3">Rs. {price}</h4>
          <p>{product.description}</p>

          {/* QUANTITY */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <strong>Quantity:</strong>
            <div className="d-flex align-items-center border rounded">
              <button
                className="btn btn-light px-3"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="px-3 fw-bold">{quantity}</span>
              <button
                className="btn btn-light px-3"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="d-flex gap-3 mb-3">
            <button className="btn btn-primary" onClick={() => addItem(false)}>
              🛒 Add to Cart
            </button>
            <button className="btn btn-success" onClick={() => addItem(true)}>
              ⚡ Buy Now
            </button>
          </div>

          {/* SHARE (FIXED ONLY HERE) */}
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleNativeShare}
            >
              <FaShareAlt />
            </button>

            <button
              className="btn btn-outline-success btn-sm"
              onClick={handleWhatsAppShare}
            >
              <FaWhatsapp />
            </button>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleCopyLink}
            >
              <FaLink />
            </button>
          </div>
        </div>
      </div>

      {/* RELATED (UNCHANGED) */}
      {related.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-bold mb-3">Related Products</h4>
          <div className="row g-3">
            {related.map((p) => (
              <div key={p._id} className="col-6 col-md-4 col-lg-3">
                <Suspense fallback={null}>
                  <ProductCard product={p} />
                </Suspense>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;

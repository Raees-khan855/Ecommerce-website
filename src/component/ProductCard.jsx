import React, { useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import BACKEND_URL from "../config";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShareAlt } from "react-icons/fa";

function ProductCard({ product, showShare = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);

  /* ================= IMAGE ================= */
  const rawImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image;

  const productImage = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BACKEND_URL}/${rawImage.replace(/^\/+/, "")}`
    : "https://via.placeholder.com/300?text=No+Image";

  /* ================= RATING (fake demo rating) ================= */
  const rating = useMemo(
    () => (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
    [product._id],
  );

  /* ================= NAVIGATION ================= */
  const goToProduct = useCallback(() => {
    // 🔥 ID based route (best for ads + tracking)
    navigate(`/products/${product._id}`);
  }, [navigate, product._id]);

  /* ================= ADD TO CART ================= */
  const handleAdd = useCallback(
    (e) => {
      e.stopPropagation();

      dispatch(
        addToCart({
          id: product._id,
          title: product.title,
          price: Number(product.price),
          image: productImage,
        }),
      );

      /* ===== TikTok Pixel (optional but recommended) ===== */
      if (window.ttq) {
        window.ttq.track("AddToCart", {
          content_id: product._id,
          content_name: product.title,
          value: Number(product.price),
          currency: "PKR",
        });
      }

      /* ===== Facebook Pixel (optional) ===== */
      if (window.fbq) {
        window.fbq("track", "AddToCart", {
          content_ids: [product._id],
          content_type: "product",
          value: Number(product.price),
          currency: "PKR",
        });
      }
    },
    [dispatch, product, productImage],
  );

  /* ================= SHARE ================= */
  const handleShare = useCallback(
    async (e) => {
      e.stopPropagation();

      if (isSharing) return;
      setIsSharing(true);

      const url = `${window.location.origin}/#/products/${product._id}`;

      try {
        if (navigator.share) {
          await navigator.share({
            title: product.title,
            text: `Check out this product: ${product.title}`,
            url,
          });
        } else {
          await navigator.clipboard.writeText(url);
          alert("Product link copied!");
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setIsSharing(false);
      }
    },
    [isSharing, product],
  );

  /* ================= UI ================= */
  return (
    <div
      onClick={goToProduct}
      className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden"
      style={{
        cursor: "pointer",
        touchAction: "manipulation", // 🔥 mobile faster taps
        transition: "transform .25s ease, box-shadow .25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      {/* ================= IMAGE ================= */}
      <div
        className="bg-light d-flex align-items-center justify-content-center"
        style={{ height: 200, padding: 12 }}
      >
        <img
          src={productImage}
          alt={product.title}
          loading="lazy"
          className="img-fluid"
          style={{ maxHeight: "100%", objectFit: "contain" }}
        />
      </div>

      {/* ================= BODY ================= */}
      <div className="card-body d-flex flex-column p-2">
        {/* TITLE */}
        <h6
          title={product.title}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          {product.title}
        </h6>

        {/* PRICE */}
        <span className="text-muted small mb-1">
          Rs.{Number(product.price).toFixed(2)}
        </span>

        {/* RATING */}
        <div className="d-flex align-items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((i) =>
            rating >= i ? (
              <FaStar key={i} size={14} className="text-warning" />
            ) : rating >= i - 0.5 ? (
              <FaStarHalfAlt key={i} size={14} className="text-warning" />
            ) : (
              <FaRegStar key={i} size={14} className="text-warning" />
            ),
          )}
          <span className="small text-muted ms-1">({rating})</span>
        </div>

        {/* ACTIONS */}
        <div className="mt-auto d-flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToProduct();
            }}
            className="btn btn-outline-primary btn-sm flex-grow-1"
          >
            View
          </button>

          <button
            onClick={handleAdd}
            className="btn btn-primary btn-sm flex-grow-1"
          >
            Add
          </button>

          {showShare && (
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="btn btn-outline-secondary btn-sm"
            >
              {isSharing ? "..." : <FaShareAlt />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import BACKEND_URL from "../config";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShareAlt } from "react-icons/fa";

function ProductCard({ product, showShare = false }) {
  const dispatch = useDispatch();
  const [isSharing, setIsSharing] = useState(false);

  // ⭐ Memoize fake rating so it doesn't recalc on every render
  const rating = useMemo(
    () => (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
    [product._id], // recalc only if product changes
  );

  // ================= IMAGE =================
  const rawImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image;

  const productImage = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BACKEND_URL}/${rawImage.replace(/^\/+/, "")}`
    : "https://via.placeholder.com/300?text=No+Image";

  const productUrl = `${window.location.origin}/#/products/${product._id}`;

  // ================= ADD TO CART =================
  const handleAdd = () => {
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: Number(product.price),
        image: productImage,
      }),
    );
  };

  // ================= SHARE =================
  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: `Check out this product: ${product.title}`,
          url: productUrl,
        });
      } else {
        await navigator.clipboard.writeText(productUrl);
        alert("Product link copied!");
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
      {/* IMAGE */}
      <div
        className="bg-light d-flex align-items-center justify-content-center"
        style={{ height: "200px", padding: "12px" }}
      >
        <img
          src={productImage}
          alt={product.title}
          className="img-fluid"
          style={{ maxHeight: "100%", objectFit: "contain" }}
          loading="lazy" // ✅ lazy load
        />
      </div>

      {/* BODY */}
      <div className="card-body d-flex flex-column text-center p-3">
        <h6 className="fw-semibold mb-1 text-truncate">{product.title}</h6>
        <span className="text-muted small mb-1">
          Rs.{Number(product.price).toFixed(2)}
        </span>

        {/* STARS */}
        <div className="d-flex justify-content-center align-items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((i) =>
            rating >= i ? (
              <FaStar key={i} className="text-warning" size={14} />
            ) : rating >= i - 0.5 ? (
              <FaStarHalfAlt key={i} className="text-warning" size={14} />
            ) : (
              <FaRegStar key={i} className="text-warning" size={14} />
            ),
          )}
          <span className="small text-muted ms-1">({rating})</span>
        </div>

        {/* ACTIONS */}
        <div className="mt-auto d-flex gap-2">
          <Link
            to={`/products/${product._id}`}
            className="btn btn-outline-primary btn-sm flex-grow-1"
          >
            View
          </Link>
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
              title="Share product"
            >
              {isSharing ? "..." : <FaShareAlt />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Memoize entire component to avoid re-renders if props don't change
export default React.memo(ProductCard);

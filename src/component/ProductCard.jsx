import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import BACKEND_URL from "../config";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShareAlt } from "react-icons/fa";

function ProductCard({ product, showShare = false }) {
  const dispatch = useDispatch();
  const [isSharing, setIsSharing] = useState(false);

  const rating = useMemo(
    () => (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
    [product._id],
  );

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
    <div
      className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden"
      style={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
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
          loading="lazy"
        />
      </div>

      {/* BODY */}
      <div className="card-body d-flex flex-column p-2">
        {/* TITLE 3 LINES */}
        <h6
          title={product.title}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: 600,
            margin: "0.25rem 0 0.5rem 0",
            paddingLeft: "0.5rem",
          }}
        >
          {product.title}
        </h6>

        {/* PRICE */}
        <span
          className="text-muted small mb-1"
          style={{ paddingLeft: "0.5rem" }}
        >
          Rs.{Number(product.price).toFixed(2)}
        </span>

        {/* STARS */}
        <div className="d-flex justify-content-start align-items-center gap-1 mb-3 ps-1">
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
        <div className="mt-auto d-flex gap-2 px-1 pb-1">
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

export default React.memo(ProductCard);

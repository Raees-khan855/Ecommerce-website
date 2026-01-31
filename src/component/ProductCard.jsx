import React, { useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import BACKEND_URL from "../config";

import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaWhatsapp,
  FaCopy,
  FaShareAlt,
} from "react-icons/fa";

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

  /* ================= DEMO RATING ================= */
  const rating = useMemo(
    () => (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
    [product._id],
  );

  /* ================= URL ================= */
  const productUrl = `${window.location.origin}/products/${product._id}`;

  /* ================= NAVIGATION ================= */
  const goToProduct = useCallback(() => {
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
    },
    [dispatch, product, productImage],
  );

  /* ================= SHARE FUNCTIONS ================= */

  // ✅ WhatsApp (guaranteed — no popup block)
  const handleWhatsApp = useCallback(
    (e) => {
      e.stopPropagation();
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(productUrl)}`;
      window.location.href = whatsappUrl;
    },
    [productUrl],
  );

  // ✅ Copy (works even on old browsers)
  const handleCopy = useCallback(
    (e) => {
      e.stopPropagation();

      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(productUrl);
        } else {
          const input = document.createElement("input");
          input.value = productUrl;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
        }

        alert("Link copied!");
      } catch {
        alert("Copy failed");
      }
    },
    [productUrl],
  );

  // ✅ Native share
  const handleNativeShare = useCallback(
    async (e) => {
      e.stopPropagation();

      if (!navigator.share) return handleWhatsApp(e);

      if (isSharing) return;

      setIsSharing(true);

      try {
        await navigator.share({
          title: product.title,
          text: product.title,
          url: productUrl,
        });
      } catch {}

      setIsSharing(false);
    },
    [product, productUrl, isSharing, handleWhatsApp],
  );

  /* ================= UI ================= */
  return (
    <div
      /* 🔥 CRITICAL FIX: only navigate if NOT clicking a button */
      onClick={(e) => {
        if (e.target.closest("button")) return;
        goToProduct();
      }}
      className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden"
      style={{
        cursor: "pointer",
        touchAction: "manipulation",
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
      {/* IMAGE */}
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

      {/* BODY */}
      <div className="card-body d-flex flex-column p-2">
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
        <div className="mt-auto d-flex gap-2 align-items-center">
          <button
            onClick={goToProduct}
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
            <>
              <button
                onClick={handleWhatsApp}
                className="btn btn-success btn-sm share-btn"
              >
                <FaWhatsapp />
              </button>

              <button
                onClick={handleCopy}
                className="btn btn-outline-secondary btn-sm share-btn"
              >
                <FaCopy />
              </button>

              <button
                onClick={handleNativeShare}
                className="btn btn-outline-dark btn-sm share-btn"
              >
                <FaShareAlt />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);

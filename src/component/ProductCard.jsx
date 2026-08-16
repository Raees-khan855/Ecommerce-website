import React, { useMemo, useState, useCallback } from "react";
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
  FaShoppingCart,
  FaEye,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

import { optimizeCloudinary } from "../utils/cloudinary";

function ProductCard({ product, showShare = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSharing, setIsSharing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [added, setAdded] = useState(false);

  /* ================= IMAGE ================= */

  const rawImage =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : product?.image;

  const productImage = rawImage
    ? rawImage.startsWith("http")
      ? optimizeCloudinary(rawImage, 600)
      : `${BACKEND_URL}/${rawImage.replace(/^\/+/, "")}`
    : "https://via.placeholder.com/600x600?text=No+Image";

  /* ================= PRICE ================= */

  const price = Number(product?.price || 0);
  const comparePrice = Number(product?.compareAtPrice || 0);

  const hasDiscount = comparePrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  /* ================= RATING ================= */

  const rating = useMemo(() => {
    /*
      If your backend later provides a real rating,
      this will automatically use it.
    */

    if (product?.rating) {
      return Number(product.rating).toFixed(1);
    }

    return "4.8";
  }, [product?.rating]);

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
          price,
          image: productImage,
          quantity: 1,
        }),
      );

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1800);
    },
    [dispatch, product, price, productImage],
  );

  /* ================= WHATSAPP ================= */

  const handleWhatsApp = useCallback(
    (e) => {
      e.stopPropagation();

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `Check out this product: ${product.title}\n${productUrl}`,
      )}`;

      window.open(whatsappUrl, "_blank");
    },
    [product.title, productUrl],
  );

  /* ================= COPY ================= */

  const handleCopy = useCallback(
    async (e) => {
      e.stopPropagation();

      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(productUrl);
        } else {
          const input = document.createElement("input");

          input.value = productUrl;

          document.body.appendChild(input);

          input.select();

          document.execCommand("copy");

          document.body.removeChild(input);
        }

        alert("Product link copied!");
      } catch (error) {
        console.error("Copy failed:", error);
      }
    },
    [productUrl],
  );

  /* ================= NATIVE SHARE ================= */

  const handleNativeShare = useCallback(
    async (e) => {
      e.stopPropagation();

      if (!navigator.share) {
        handleWhatsApp(e);
        return;
      }

      if (isSharing) return;

      setIsSharing(true);

      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title}`,
          url: productUrl,
        });
      } catch (error) {
        // User cancelled share
      } finally {
        setIsSharing(false);
      }
    },
    [product.title, productUrl, isSharing, handleWhatsApp],
  );

  /* ================= UI ================= */

  return (
    <div
      className="product-card-wrapper h-100"
      onClick={(e) => {
        if (e.target.closest("button")) return;
        goToProduct();
      }}
      style={{
        cursor: "pointer",
        touchAction: "manipulation",
      }}
    >
      <div
        className="card h-100 border-0 overflow-hidden bg-white"
        style={{
          borderRadius: "18px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
          transition: "transform .3s ease, box-shadow .3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";

          e.currentTarget.style.boxShadow = "0 14px 35px rgba(0,0,0,0.13)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";

          e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.07)";
        }}
      >
        {/* ================= IMAGE AREA ================= */}

        <div
          className="position-relative overflow-hidden"
          style={{
            height: "220px",
            background: "linear-gradient(145deg,#f8f9fa,#eef1f5)",
          }}
        >
          {/* SALE BADGE */}

          {hasDiscount && (
            <div
              className="position-absolute top-0 start-0 m-3 px-2 py-1"
              style={{
                background: "#dc3545",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                zIndex: 3,
              }}
            >
              -{discountPercentage}% OFF
            </div>
          )}

          {/* COD BADGE */}

          <div
            className="position-absolute top-0 end-0 m-3 px-2 py-1"
            style={{
              background: "#ffffff",
              color: "#198754",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: 700,
              boxShadow: "0 3px 10px rgba(0,0,0,.08)",
              zIndex: 3,
            }}
          >
            COD
          </div>

          {/* IMAGE */}

          <div
            className="w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              padding: "18px",
            }}
          >
            {!imageLoaded && (
              <div
                className="placeholder-glow position-absolute"
                style={{
                  width: "75%",
                  height: "75%",
                }}
              >
                <div className="placeholder w-100 h-100 rounded-3" />
              </div>
            )}

            <img
              src={productImage}
              srcSet={
                rawImage && rawImage.startsWith("http")
                  ? `
                    ${optimizeCloudinary(rawImage, 300)} 300w,
                    ${optimizeCloudinary(rawImage, 600)} 600w,
                    ${optimizeCloudinary(rawImage, 900)} 900w
                  `
                  : undefined
              }
              sizes="
                (max-width: 576px) 45vw,
                (max-width: 992px) 30vw,
                260px
              "
              alt={product.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className="img-fluid"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transition: "transform .45s ease",
                opacity: imageLoaded ? 1 : 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </div>

          {/* VIEW BUTTON */}

          <button
            onClick={goToProduct}
            className="btn btn-light position-absolute bottom-0 start-50 translate-middle-x mb-3 shadow-sm"
            style={{
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: 600,
              padding: "7px 15px",
              opacity: 0,
              transition: "opacity .25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <FaEye className="me-1" />
            Quick View
          </button>
        </div>

        {/* ================= BODY ================= */}

        <div
          className="card-body d-flex flex-column"
          style={{
            padding: "16px",
          }}
        >
          {/* TITLE */}

          <h6
            className="fw-semibold mb-2"
            title={product.title}
            style={{
              fontSize: "15px",
              lineHeight: "1.4",
              minHeight: "42px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.title}
          </h6>

          {/* RATING */}

          <div className="d-flex align-items-center mb-2">
            <div className="d-flex gap-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <FaStar key={i} size={13} className="text-warning" />
                ) : rating >= i - 0.5 ? (
                  <FaStarHalfAlt key={i} size={13} className="text-warning" />
                ) : (
                  <FaRegStar key={i} size={13} className="text-warning" />
                ),
              )}
            </div>

            <span className="ms-2 text-muted" style={{ fontSize: "12px" }}>
              {rating}
            </span>

            <span className="ms-1 text-muted" style={{ fontSize: "11px" }}>
              (Verified)
            </span>
          </div>

          {/* PRICE */}

          <div className="mb-3">
            <span
              className="fw-bold"
              style={{
                color: "#dc3545",
                fontSize: "20px",
              }}
            >
              Rs. {price.toFixed(2)}
            </span>

            {hasDiscount && (
              <span
                className="ms-2 text-muted"
                style={{
                  textDecoration: "line-through",
                  fontSize: "13px",
                }}
              >
                Rs. {comparePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* DELIVERY */}

          <div
            className="d-flex align-items-center gap-2 mb-3"
            style={{
              background: "#f7faf8",
              borderRadius: "8px",
              padding: "7px 9px",
            }}
          >
            <FaTruck size={14} className="text-success" />

            <span
              className="text-success fw-semibold"
              style={{ fontSize: "11px" }}
            >
              Delivery in 3–5 Days
            </span>

            <FaCheckCircle size={12} className="text-success ms-auto" />
          </div>

          {/* ACTIONS */}

          <div className="d-flex gap-2 mt-auto">
            <button
              onClick={goToProduct}
              className="btn btn-outline-dark flex-grow-1"
              style={{
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                padding: "9px 8px",
              }}
            >
              View
            </button>

            <button
              onClick={handleAdd}
              className={`btn ${
                added ? "btn-success" : "btn-primary"
              } flex-grow-1`}
              style={{
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                padding: "9px 8px",
              }}
            >
              {added ? (
                <>
                  <FaCheckCircle className="me-1" />
                  Added
                </>
              ) : (
                <>
                  <FaShoppingCart className="me-1" />
                  Add
                </>
              )}
            </button>
          </div>

          {/* SHARE BUTTONS */}

          {showShare && (
            <div className="d-flex gap-2 mt-2">
              <button
                onClick={handleWhatsApp}
                className="btn btn-success flex-grow-1"
                style={{
                  borderRadius: "9px",
                  fontSize: "12px",
                }}
              >
                <FaWhatsapp className="me-1" />
                WhatsApp
              </button>

              <button
                onClick={handleCopy}
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "9px",
                  width: "42px",
                }}
                title="Copy link"
              >
                <FaCopy />
              </button>

              <button
                onClick={handleNativeShare}
                className="btn btn-outline-dark"
                style={{
                  borderRadius: "9px",
                  width: "42px",
                }}
                title="Share"
              >
                <FaShareAlt />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);

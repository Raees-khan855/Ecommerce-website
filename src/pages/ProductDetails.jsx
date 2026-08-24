import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import BACKEND_URL from "../config";
import useSEO from "../hooks/useSEO";
import { tiktokTrack } from "../utils/tiktok";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShareAlt,
  FaWhatsapp,
  FaLink,
  FaTruck,
  FaShieldAlt,
  FaBoxOpen,
  FaPhoneAlt,
  FaMinus,
  FaPlus,
  FaCheckCircle,
  FaShoppingCart,
  FaBolt,
} from "react-icons/fa";

/* Lazy load ProductCard */
const ProductCard = lazy(() => import("../component/ProductCard"));

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [faqs, setFaqs] = useState([]);

  const reviewCount = reviews.length;

  const rating =
    reviewCount > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
          reviewCount
        ).toFixed(1)
      : 0;

  /* ================= SEO ================= */

  useSEO({
    title: product ? `${product.title} | RaeesProduct` : "Product Details",
    description: product?.description || "",
    image: product?.image || "",
    url: window.location.href,
  });

  /* ================= SCROLL TOP ================= */

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  /* ================= FETCH FAQS ================= */

  const fetchFaqs = async (productId) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/faqs/product/${productId}`,
      );

      setFaqs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("FAQ fetch error:", err);
      setFaqs([]);
    }
  };

  /* ================= FETCH REVIEWS ================= */

  const fetchReviews = async (productId) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/reviews/product/${productId}`,
      );

      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Review fetch error:", err);
      setReviews([]);
    }
  };

  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {
    let mounted = true;

    setLoading(true);

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/products/${id}`);

        if (!mounted) return;

        const prod = res.data.product || res.data;

        setProduct(prod);
        tiktokTrack("ViewContent", {
          content_id: String(prod._id),
          content_name: prod.title,
          content_type: "product",
          value: Number(prod.price || 0),
          currency: "PKR",
        });
        await fetchReviews(prod._id);
        await fetchFaqs(prod._id);

        setRelated(Array.isArray(res.data.related) ? res.data.related : []);

        const productImages =
          Array.isArray(prod.images) && prod.images.length > 0
            ? prod.images
            : prod.image
              ? [prod.image]
              : [];

        setActiveImage(productImages[0] || null);

        if (Array.isArray(prod.colors) && prod.colors.length > 0) {
          setSelectedColor(prod.colors[0]);
        } else {
          setSelectedColor("");
        }

        if (Array.isArray(prod.sizes) && prod.sizes.length > 0) {
          setSelectedSize(prod.sizes[0]);
        } else {
          setSelectedSize("");
        }
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* ================= IMAGE HELPER ================= */

  const getImageUrl = (img) => {
    if (!img) {
      return "https://via.placeholder.com/600x600?text=No+Image";
    }

    return img.startsWith("http")
      ? img
      : `${BACKEND_URL}/${img.replace(/^\/+/, "")}`;
  };

  const images =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : [];

  const mainImage = getImageUrl(activeImage);

  /* ================= ADD TO CART ================= */
  const addItem = (checkout = false) => {
    const price = Number(product.price || 0);
    const totalValue = price * quantity;

    // Add product to Redux cart
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price,
        image: mainImage,
        quantity,
        selectedColor,
        selectedSize,
      }),
    );

    // TikTok AddToCart event
    tiktokTrack("AddToCart", {
      content_id: String(product._id),
      content_name: product.title,
      content_type: "product",
      quantity: quantity,
      value: totalValue,
      currency: "PKR",
    });

    navigate(checkout ? "/checkout" : "/cart");
  };
  /* ================= SHARE ================= */

  const productUrl = window.location.href;

  const handleWhatsAppShare = () => {
    const message = `Check out this product: ${product.title}\n${productUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      handleWhatsAppShare();
      return;
    }

    try {
      await navigator.share({
        title: product.title,
        url: productUrl,
      });
    } catch {}
  };

  /* ================= RATING STARS ================= */

  const renderStars = (value) => {
    return [1, 2, 3, 4, 5].map((i) =>
      value >= i ? (
        <FaStar key={i} />
      ) : value >= i - 0.5 ? (
        <FaStarHalfAlt key={i} />
      ) : (
        <FaRegStar key={i} />
      ),
    );
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-6">
            <div
              className="placeholder-glow bg-light rounded-4"
              style={{ height: 520 }}
            />
          </div>

          <div className="col-lg-6">
            <div className="placeholder-glow">
              <span className="placeholder col-3 mb-3" />
              <span className="placeholder col-10 mb-3" />
              <span className="placeholder col-5 mb-4" />
              <span className="placeholder col-8 mb-3" />
              <span className="placeholder col-12 mb-3" />
              <span className="placeholder col-7 mb-4" />
              <span className="placeholder col-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= PRODUCT NOT FOUND ================= */

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <div className="display-1">😕</div>

        <h3 className="fw-bold mt-3">Product Not Found</h3>

        <p className="text-muted">
          Sorry, this product is no longer available.
        </p>

        <button
          className="btn btn-dark px-4"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div
      style={{
        background: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div className="container-xl py-4 py-lg-5">
        {/* ================= BREADCRUMB ================= */}

        <div className="mb-4 small text-muted">
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            Home
          </span>

          <span className="mx-2">/</span>

          <span
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/products")}
          >
            Products
          </span>

          <span className="mx-2">/</span>

          <span className="text-dark">{product.title}</span>
        </div>

        {/* ================= PRODUCT ================= */}

        <div className="row g-4 g-lg-5">
          {/* ================= GALLERY ================= */}

          <div className="col-12 col-lg-6">
            <div
              className="bg-white rounded-4 shadow-sm p-3 p-md-4"
              style={{
                position: "sticky",
                top: 20,
              }}
            >
              {/* Main Image */}

              <div
                className="d-flex align-items-center justify-content-center rounded-4"
                style={{
                  height: "clamp(320px, 55vw, 520px)",
                  background: "#f8f9fa",
                  overflow: "hidden",
                }}
              >
                <img
                  src={mainImage}
                  alt={product.title}
                  loading="eager"
                  className="img-fluid"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "15px",
                  }}
                />
              </div>

              {/* Thumbnails */}

              {images.length > 1 && (
                <div className="d-flex gap-2 mt-3 overflow-auto pb-1">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className="bg-white p-0 flex-shrink-0"
                      style={{
                        width: 76,
                        height: 76,
                        border:
                          img === activeImage
                            ? "2px solid #0d6efd"
                            : "1px solid #dee2e6",
                        borderRadius: 12,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${product.title} ${index + 1}`}
                        width="76"
                        height="76"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Gallery trust */}

              <div className="row g-2 mt-3">
                <div className="col-4">
                  <div className="text-center p-2 rounded-3 bg-light">
                    <FaShieldAlt className="text-primary mb-1" />
                    <div className="small fw-semibold">Secure</div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="text-center p-2 rounded-3 bg-light">
                    <FaTruck className="text-success mb-1" />
                    <div className="small fw-semibold">Fast Delivery</div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="text-center p-2 rounded-3 bg-light">
                    <FaBoxOpen className="text-warning mb-1" />
                    <div className="small fw-semibold">Quality Pack</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= DETAILS ================= */}

          <div className="col-12 col-lg-6">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
              {/* Category */}

              {product.category && (
                <div className="mb-2">
                  <span className="badge bg-light text-primary border">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Title */}

              <h1
                className="fw-bold mb-3"
                style={{
                  fontSize: "clamp(25px, 4vw, 38px)",
                  lineHeight: 1.2,
                }}
              >
                {product.title}
              </h1>

              {/* Rating */}

              <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                <div
                  className="d-flex gap-1"
                  style={{
                    color: "#ffc107",
                  }}
                >
                  {renderStars(Number(rating))}
                </div>

                <strong>{rating}</strong>

                <span className="text-muted">
                  ({reviewCount} customer reviews)
                </span>
              </div>

              <hr />

              {/* Price */}

              <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
                <span
                  className="fw-bold"
                  style={{
                    fontSize: 32,
                    color: "#dc3545",
                  }}
                >
                  Rs. {Number(product.price || 0).toFixed(2)}
                </span>

                {product.compareAtPrice &&
                  Number(product.compareAtPrice) > Number(product.price) && (
                    <>
                      <span
                        className="text-muted text-decoration-line-through"
                        style={{ fontSize: 18 }}
                      >
                        Rs. {Number(product.compareAtPrice).toFixed(2)}
                      </span>

                      <span className="badge bg-danger">SALE</span>
                    </>
                  )}
              </div>

              {/* Description */}

              <div className="mb-4">
                <h6 className="fw-bold">Product Description</h6>

                <p
                  className="text-muted mb-0"
                  style={{
                    lineHeight: 1.7,
                  }}
                >
                  {product.description}
                </p>
              </div>

              {/* Colors */}

              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div className="mb-4">
                  <div className="fw-bold mb-2">
                    Color:
                    <span className="fw-normal text-muted ms-2">
                      {selectedColor}
                    </span>
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          backgroundColor: color,
                          border:
                            selectedColor === color
                              ? "3px solid #0d6efd"
                              : "2px solid #dee2e6",
                          boxShadow:
                            selectedColor === color
                              ? "0 0 0 3px rgba(13,110,253,.15)"
                              : "none",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}

              {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                <div className="mb-4">
                  <div className="fw-bold mb-2">Select Size:</div>

                  <div className="d-flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className="px-3 py-2 rounded-3 fw-semibold"
                        style={{
                          border:
                            selectedSize === size
                              ? "2px solid #0d6efd"
                              : "1px solid #dee2e6",
                          background:
                            selectedSize === size ? "#eaf2ff" : "#fff",
                          color: selectedSize === size ? "#0d6efd" : "#212529",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}

              <div className="mb-4">
                <div className="fw-bold mb-2">Quantity</div>

                <div
                  className="d-flex align-items-center border rounded-3"
                  style={{
                    width: "fit-content",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-light border-0"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <FaMinus size={12} />
                  </button>

                  <span
                    className="px-4 fw-bold"
                    style={{
                      minWidth: 55,
                      textAlign: "center",
                    }}
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    className="btn btn-light border-0"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>

              {/* Buttons */}

              <div className="d-grid gap-2 mb-4">
                <button
                  className="btn btn-primary btn-lg rounded-3 fw-bold py-3"
                  onClick={() => addItem(false)}
                >
                  <FaShoppingCart className="me-2" />
                  Add to Cart
                </button>

                <button
                  className="btn btn-success btn-lg rounded-3 fw-bold py-3"
                  onClick={() => addItem(true)}
                >
                  <FaBolt className="me-2" />
                  Buy Now
                </button>
              </div>

              {/* Delivery Highlight */}

              <div
                className="rounded-4 p-3 mb-4"
                style={{
                  background: "linear-gradient(135deg,#f0fff4,#ffffff)",
                  border: "1px solid #d8f3df",
                }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: 48,
                      height: 48,
                      background: "#dcfce7",
                      color: "#198754",
                    }}
                  >
                    <FaTruck />
                  </div>

                  <div>
                    <div className="fw-bold">Delivery in 3–5 Days</div>

                    <div className="small text-muted">
                      Fast delivery across Pakistan.
                    </div>
                  </div>
                </div>
              </div>

              {/* Share */}

              <div>
                <div className="small fw-bold text-muted mb-2">
                  SHARE THIS PRODUCT
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-light border rounded-circle"
                    style={{
                      width: 42,
                      height: 42,
                    }}
                    onClick={handleNativeShare}
                  >
                    <FaShareAlt />
                  </button>

                  <button
                    type="button"
                    className="btn btn-light border text-success rounded-circle"
                    style={{
                      width: 42,
                      height: 42,
                    }}
                    onClick={handleWhatsAppShare}
                  >
                    <FaWhatsapp />
                  </button>

                  <div className="position-relative">
                    <button
                      type="button"
                      className="btn btn-light border text-primary rounded-circle"
                      style={{
                        width: 42,
                        height: 42,
                      }}
                      onClick={handleCopyLink}
                    >
                      <FaLink />
                    </button>

                    {copied && (
                      <span
                        className="position-absolute bg-dark text-white small rounded px-2 py-1"
                        style={{
                          top: -35,
                          left: "50%",
                          transform: "translateX(-50%)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DELIVERY INFORMATION ================= */}

        <section className="mt-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Delivery & Shopping Information</h2>

            <p className="text-muted">
              Everything you need to know before ordering.
            </p>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: 50,
                    height: 50,
                    background: "#eaf2ff",
                    color: "#0d6efd",
                  }}
                >
                  <FaTruck />
                </div>

                <h6 className="fw-bold">Delivery in 3–5 Days</h6>

                <p className="small text-muted mb-0">
                  Your order will normally arrive within 3–5 working days.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: 50,
                    height: 50,
                    background: "#e8f5e9",
                    color: "#198754",
                  }}
                >
                  <FaBoxOpen />
                </div>

                <h6 className="fw-bold">Secure Packaging</h6>

                <p className="small text-muted mb-0">
                  Products are carefully packed before dispatch.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: 50,
                    height: 50,
                    background: "#fff3cd",
                    color: "#997404",
                  }}
                >
                  <FaPhoneAlt />
                </div>

                <h6 className="fw-bold">Order Confirmation</h6>

                <p className="small text-muted mb-0">
                  We may contact you to confirm your order before dispatch.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: 50,
                    height: 50,
                    background: "#f3e8ff",
                    color: "#7c3aed",
                  }}
                >
                  <FaShieldAlt />
                </div>

                <h6 className="fw-bold">Safe Shopping</h6>

                <p className="small text-muted mb-0">
                  Shop confidently with our secure ordering process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= REVIEWS ================= */}

        <section className="mt-5">
          <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
              <div>
                <h2 className="fw-bold mb-1">Customer Reviews</h2>

                <div className="text-muted">
                  {reviewCount} customer review
                  {reviewCount !== 1 ? "s" : ""}
                </div>
              </div>

              {reviewCount > 0 && (
                <div className="text-end">
                  <div
                    className="d-flex gap-1 justify-content-end"
                    style={{
                      color: "#ffc107",
                    }}
                  >
                    {renderStars(Number(rating))}
                  </div>

                  <strong>{rating} / 5</strong>
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-4">
                <div className="display-5 mb-2">⭐</div>

                <h6 className="fw-bold">No reviews yet</h6>

                <p className="text-muted mb-0">
                  Be the first customer to review this product.
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {reviews.map((review) => (
                  <div key={review._id} className="col-12 col-md-6 col-lg-4">
                    <div
                      className="border rounded-4 p-4 h-100"
                      style={{
                        background: "#fafafa",
                      }}
                    >
                      <div className="d-flex align-items-center mb-3">
                        {review.image ? (
                          <img
                            src={review.image}
                            alt={review.customerName}
                            width="48"
                            height="48"
                            style={{
                              width: 48,
                              height: 48,
                              objectFit: "cover",
                              borderRadius: "50%",
                              marginRight: 12,
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold me-3"
                            style={{
                              width: 48,
                              height: 48,
                            }}
                          >
                            {review.customerName?.charAt(0)?.toUpperCase() ||
                              "C"}
                          </div>
                        )}

                        <div>
                          <div className="fw-bold">{review.customerName}</div>

                          {review.verified && (
                            <div className="small text-success">
                              <FaCheckCircle className="me-1" />
                              Verified Purchase
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className="mb-2"
                        style={{
                          color: "#ffc107",
                        }}
                      >
                        {renderStars(Number(review.rating || 0))}
                      </div>

                      <p className="text-muted mb-0">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= RELATED PRODUCTS ================= */}

        {related.length > 0 && (
          <section className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-1">You May Also Like</h2>

                <p className="text-muted mb-0">
                  Explore more products you might like.
                </p>
              </div>

              <button
                className="btn btn-outline-dark rounded-pill px-4"
                onClick={() => navigate("/products")}
              >
                View All
              </button>
            </div>

            <div className="row g-3">
              {related.map((p) => (
                <div key={p._id} className="col-6 col-md-4 col-lg-3">
                  <Suspense fallback={null}>
                    <ProductCard product={p} />
                  </Suspense>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= FAQ ================= */}

        <section className="mt-5 mb-5">
          <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Frequently Asked Questions</h2>

              <p className="text-muted">Find answers to common questions.</p>
            </div>

            {faqs.length === 0 ? (
              <div className="text-center py-3 text-muted">
                No frequently asked questions available for this product.
              </div>
            ) : (
              <div className="accordion" id="productFaqAccordion">
                {faqs.map((faq, index) => (
                  <div
                    className="accordion-item mb-2 border rounded-3 overflow-hidden"
                    key={faq._id}
                  >
                    <h2 className="accordion-header" id={`heading-${faq._id}`}>
                      <button
                        className={`accordion-button ${
                          index !== 0 ? "collapsed" : ""
                        } fw-semibold`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${faq._id}`}
                        aria-expanded={index === 0 ? "true" : "false"}
                        aria-controls={`collapse-${faq._id}`}
                      >
                        {faq.question}
                      </button>
                    </h2>

                    <div
                      id={`collapse-${faq._id}`}
                      className={`accordion-collapse collapse ${
                        index === 0 ? "show" : ""
                      }`}
                      aria-labelledby={`heading-${faq._id}`}
                      data-bs-parent="#productFaqAccordion"
                    >
                      <div className="accordion-body text-muted">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetails;

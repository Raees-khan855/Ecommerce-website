import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import ProductCard from "../component/ProductCard";
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

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const rating = 4.6;
  const reviewCount = 128;

  /* ================= SEO ================= */
  useSEO({
    title: product ? `${product.title} | RaeesProduct` : "Product Details",
    description: product?.description || "",
    image: product?.image || "",
    url: window.location.href,
  });

  /* ================= SCROLL TO TOP ================= */
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
        setRelated(Array.isArray(res.data.related) ? res.data.related : []);

        if (Array.isArray(prod.images) && prod.images.length > 0) {
          setActiveImage(prod.images[0]);
        } else if (prod.image) {
          setActiveImage(prod.image);
        }
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => (mounted = false);
  }, [id]);

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

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  /* ================= ADD TO CART (DIRECT TO CART) ================= */
  const addItem = () => {
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: Number(product.price || 0),
        image: mainImage,
        quantity,
      }),
    );

    // TikTok tracking (optional)
    if (window.ttq) {
      window.ttq.track("AddToCart", {
        content_id: product._id,
        content_name: product.title,
        value: Number(product.price || 0) * quantity,
        currency: "PKR",
        quantity,
      });
    }

    // Immediately go to cart
    navigate("/cart");
  };

  /* ================= SHARE HANDLERS ================= */
  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: `Check out this product: ${product.title}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Product link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleWhatsappShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this product: ${product.title}`);
    window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
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
              className="img-fluid mb-3"
              style={{ maxHeight: "420px", objectFit: "contain" }}
            />
            {images.length > 1 && (
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={getImageUrl(img)}
                    alt="thumb"
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: 64,
                      height: 64,
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

          {/* ⭐ Rating */}
          <div className="d-flex align-items-center gap-1 mb-2 mt-2">
            {[1, 2, 3, 4, 5].map((i) => {
              if (rating >= i)
                return <FaStar key={i} className="text-warning" />;
              if (rating >= i - 0.5)
                return <FaStarHalfAlt key={i} className="text-warning" />;
              return <FaRegStar key={i} className="text-warning" />;
            })}
            <span className="small text-muted ms-2">
              {rating} ({reviewCount} reviews)
            </span>
          </div>

          <p className="text-muted">
            <strong>Category:</strong> {product.category}
          </p>

          <h4 className="text-primary fw-bold mb-3">Rs. {price}</h4>

          <p>{product.description || "No description available."}</p>

          {/* QUANTITY */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <strong>Quantity:</strong>
            <div className="d-flex align-items-center border rounded">
              <button className="btn btn-light px-3" onClick={decreaseQty}>
                −
              </button>
              <span className="px-3 fw-bold">{quantity}</span>
              <button className="btn btn-light px-3" onClick={increaseQty}>
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex gap-3 flex-wrap mb-2">
            <button className="btn btn-primary" onClick={addItem}>
              🛒 Add to Cart
            </button>

            <button
              className="btn btn-success"
              onClick={() => {
                dispatch(
                  addToCart({
                    id: product._id,
                    title: product.title,
                    price: Number(product.price || 0),
                    image: mainImage,
                    quantity,
                  }),
                );
                navigate("/checkout");
              }}
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* SMALL SHARE ICONS */}
          <div className="d-flex gap-2 mt-60">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleShare}
              title="Share"
            >
              <FaShareAlt />
            </button>

            <button
              className="btn btn-outline-success btn-sm"
              onClick={handleWhatsappShare}
              title="Share on WhatsApp"
            >
              <FaWhatsapp />
            </button>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleCopyLink}
              title="Copy Link"
            >
              <FaLink />
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-bold mb-3">Related Products</h4>
          <div className="row g-3">
            {related.map((p) => (
              <div key={p._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;

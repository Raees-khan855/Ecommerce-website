import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import BACKEND_URL from "../config";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  /* ================= IMAGE FIX (5 IMAGES SUPPORT) ================= */
  const rawImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0] // ✅ first image
      : product.image;

  const productImage = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BACKEND_URL}/${rawImage.replace(/^\/+/, "")}`
    : "https://via.placeholder.com/300?text=No+Image";

  const handleAdd = () => {
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: Number(product.price),
        image: productImage,
      })
    );
  };

  return (
    <div
      className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden"
      style={{ maxWidth: "260px", width: "100%" }}
    >
      {/* IMAGE */}
      <div
        className="bg-light d-flex align-items-center justify-content-center"
        style={{ height: "200px", padding: "12px" }}
      >
        <img
          src={productImage}
          alt={product?.title || "Product image"}
          className="img-fluid"
          style={{ maxHeight: "100%", objectFit: "contain" }}
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/300?text=No+Image")
          }
        />
      </div>

      {/* BODY */}
      <div className="card-body d-flex flex-column text-center p-3">
        <h6 className="fw-semibold mb-1 text-truncate" title={product.title}>
          {product.title}
        </h6>

        <span className="text-muted small mb-3">
          Rs.{Number(product.price).toFixed(2)}
        </span>

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
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import BACKEND_URL from "../config";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  // Fix image URL (important for Vercel)
  const productImage = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BACKEND_URL}${product.image}`
    : "https://via.placeholder.com/200?text=No+Image";

  const handleAdd = () => {
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: Number(product.price),
        image: productImage, // ✅ store full URL
      })
    );
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
      {/* Image */}
      <div
        className="bg-light d-flex align-items-center justify-content-center p-3"
        style={{ height: "220px" }}
      >
        <img
          src={productImage}
          alt={product.title}
          className="img-fluid"
          style={{ objectFit: "contain", maxHeight: "100%" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200?text=No+Image";
          }}
        />
      </div>

      {/* Content */}
      <div className="card-body d-flex flex-column text-center">
        <h6 className="fw-semibold text-truncate mb-1">{product.title}</h6>

        <span className="text-muted small mb-3">
          ${Number(product.price).toFixed(2)}
        </span>

        {/* Actions */}
        <div className="mt-auto d-flex gap-2">
          <Link
            to={`/products/${product._id}`} // ✅ route fixed
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

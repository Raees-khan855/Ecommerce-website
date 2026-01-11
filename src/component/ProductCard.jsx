import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import BACKEND_URL from "../config";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  // ⭐ Fake rating (3.8 – 5.0)
  const rating = (Math.random() * (5 - 3.8) + 3.8).toFixed(1);

  /* IMAGE FIX */
  const rawImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
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
      style={{ maxWidth: "260px" }}
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
        />
      </div>

      {/* BODY */}
      <div className="card-body d-flex flex-column text-center p-3">
        <h6 className="fw-semibold mb-1 text-truncate">{product.title}</h6>

        <span className="text-muted small mb-1">
          Rs.{Number(product.price).toFixed(2)}
        </span>

        {/* ⭐ FAKE STARS */}
        <div className="d-flex justify-content-center align-items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((i) => {
            if (rating >= i)
              return <FaStar key={i} className="text-warning" size={14} />;
            if (rating >= i - 0.5)
              return (
                <FaStarHalfAlt key={i} className="text-warning" size={14} />
              );
            return <FaRegStar key={i} className="text-warning" size={14} />;
          })}
          <span className="small text-muted ms-1">({rating})</span>
        </div>

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

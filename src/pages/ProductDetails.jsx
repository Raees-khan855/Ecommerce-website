import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import ProductCard from "../component/ProductCard";
import BACKEND_URL from "../config";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ fetch product by ID
        const res = await axios.get(`${BACKEND_URL}/products/${id}`);
        setProduct(res.data);

        // ✅ optional related products (safe)
        if (res.data?.category) {
          const relatedRes = await axios.get(
            `${BACKEND_URL}/products?category=${res.data.category}`
          );
          setRelated(relatedRes.data.filter((p) => p._id !== res.data._id));
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="text-center my-5">
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  // =========================
  // IMAGE HANDLING (FIXED)
  // =========================
  const productImage = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BACKEND_URL}${product.image}`
    : "https://via.placeholder.com/400?text=No+Image";

  const handleAddToCart = () => {
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
    <div className="container py-4">
      <div className="row g-4 align-items-center">
        {/* IMAGE */}
        <div className="col-md-6 text-center">
          <div className="card p-3 shadow-sm border-0">
            <img
              src={productImage}
              alt={product.title}
              className="img-fluid"
              style={{ maxHeight: "420px", objectFit: "contain" }}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/400?text=No+Image")
              }
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.title}</h2>

          <p className="text-muted">
            <strong>Category:</strong> {product.category || "N/A"}
          </p>

          <h4 className="text-primary mb-3">
            ${Number(product.price).toFixed(2)}
          </h4>

          <p className="text-secondary">
            {product.description || "No description available."}
          </p>

          <div className="d-flex gap-3 mt-4">
            <button
              className="btn btn-primary btn-lg w-100"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>

            <button
              className="btn btn-success btn-lg w-100"
              onClick={() => {
                handleAddToCart();
                navigate("/checkout");
              }}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-bold mb-3">Related Products</h4>
          <div className="row g-3">
            {related.map((item) => (
              <div key={item._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;

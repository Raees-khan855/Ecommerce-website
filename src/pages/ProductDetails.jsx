import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import ProductCard from "../component/ProductCard";
import BACKEND_URL from "../config";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FORCE SCROLL TO TOP ================= */
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

        setProduct(res.data.product || res.data);
        setRelated(Array.isArray(res.data.related) ? res.data.related : []);
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => (mounted = false);
  }, [id]);

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

  /* ================= HELPERS ================= */
  const getImageUrl = (img) =>
    img
      ? img.startsWith("http")
        ? img
        : `${BACKEND_URL}/${img.replace(/^\/+/, "")}`
      : "https://via.placeholder.com/400?text=No+Image";

  const image = getImageUrl(product.image);
  const price = Number(product.price || 0).toFixed(2);
  const description =
    product.description?.trim() || "No description available.";
  const category = product.category || "N/A";

  const addItem = () =>
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: Number(product.price || 0),
        image,
      })
    );

  /* ================= UI ================= */
  return (
    <div className="container py-4">
      {/* PRODUCT */}
      <div className="row g-4 align-items-center">
        <div className="col-12 col-md-6 text-center">
          <div className="bg-light p-3 rounded shadow-sm">
            <img
              src={image}
              alt={product.title}
              className="img-fluid"
              style={{ maxHeight: "420px", objectFit: "contain" }}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/400?text=No+Image")
              }
            />
          </div>
        </div>

        <div className="col-12 col-md-6">
          <h2 className="fw-bold">{product.title}</h2>

          <p className="text-muted mb-1">
            <strong>Category:</strong> {category}
          </p>

          <h4 className="text-primary fw-bold mb-3">${price}</h4>

          <p className="mb-4">{description}</p>

          <div className="d-flex flex-wrap gap-3">
            <button className="btn btn-primary px-4" onClick={addItem}>
              🛒 Add to Cart
            </button>

            <button
              className="btn btn-success px-4"
              onClick={() => {
                addItem();
                navigate("/checkout");
              }}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* RELATED */}
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

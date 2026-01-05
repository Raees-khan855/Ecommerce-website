import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import ProductCard from "../component/ProductCard";
import BACKEND_URL from "../config";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/products/${id}`);

        if (!mounted) return;

        setProduct(res.data.product || res.data);
        setRelated(res.data.related || []);
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => (mounted = false);
  }, [id]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (!product)
    return <h4 className="text-center mt-5 text-danger">Product not found</h4>;

  // ✅ SAFE FALLBACKS
  const price = Number(product.price || 0).toFixed(2);

  const image =
    product.image && product.image.startsWith("http")
      ? product.image
      : "https://via.placeholder.com/400?text=No+Image";

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

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-center">
        <div className="col-md-6 text-center">
          <img
            src={image}
            alt={product.title}
            className="img-fluid"
            style={{ maxHeight: 420, objectFit: "contain" }}
          />
        </div>

        <div className="col-md-6">
          <h2>{product.title}</h2>
          <p>
            <strong>Category:</strong> {category}
          </p>
          <h4 className="text-primary">${price}</h4>
          <p>{description}</p>

          <div className="d-flex gap-3">
            <button className="btn btn-primary" onClick={addItem}>
              🛒 Add to Cart
            </button>
            <button
              className="btn btn-success"
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

      {related.length > 0 && (
        <div className="mt-5">
          <h4>Related Products</h4>
          <div className="row g-3">
            {related.map((p) => (
              <div key={p._id} className="col-6 col-md-3">
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

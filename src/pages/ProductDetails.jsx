import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import ProductCard from "../component/ProductCard";
import { BACKEND_URL } from "../config";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products/${id}`);
        if (isMounted) {
          setProduct(res.data.product);
          setRelated(res.data.related || []);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => (isMounted = false);
  }, [id]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center my-5">
        <h4 className="text-danger fw-semibold">Product not found</h4>
      </div>
    );

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-center">
        {/* Product Image */}
        <div className="col-md-6 text-center">
          <div className="card border-0 shadow-sm p-3">
            <img
              src={product.image}
              alt={product.title}
              className="img-fluid"
              style={{ maxHeight: "420px", objectFit: "contain" }}
              onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.title}</h2>
          <p className="text-muted"><strong>Category:</strong> {product.category}</p>
          <h4 className="text-primary mb-3">${Number(product.price).toFixed(2)}</h4>
          <p className="text-secondary" style={{ lineHeight: 1.6 }}>
            {product.description || "No description available."}
          </p>

          <div className="d-flex flex-column flex-sm-row gap-3 mt-3">
            <button
              className="btn btn-primary btn-lg flex-grow-1"
              onClick={() =>
                dispatch(addToCart({ id: product._id, title: product.title, price: Number(product.price), image: product.image }))
              }
            >
              🛒 Add to Cart
            </button>

            <button
              className="btn btn-success btn-lg flex-grow-1"
              onClick={() => {
                dispatch(addToCart({ id: product._id, title: product.title, price: Number(product.price), image: product.image }));
                navigate("/checkout");
              }}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-bold mb-3">Related Products</h4>
          <div className="row g-3">
            {related.map((item) => (
              <div key={item._id} className="col-6 col-md-4 col-lg-3 d-flex">
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

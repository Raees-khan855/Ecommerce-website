import React, { useState, useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

function AdminPanel() {
  /* ================= AUTH ================= */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("adminToken");

  /* ================= HERO ================= */
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);

  /* ================= PRODUCTS ================= */
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]); // files
  const [productPreviews, setProductPreviews] = useState([]); // preview urls
  const [editingProductId, setEditingProductId] = useState(null);
  const [productPreview, setProductPreview] = useState(null);
  const [featured, setFeatured] = useState(false);

  /* ================= ORDERS ================= */
  const [orders, setOrders] = useState([]);

  const [activeTab, setActiveTab] = useState("hero");

  /* ================= IMAGE HELPER ================= */
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/80";
    if (img.startsWith("http")) return img;
    return `${BACKEND_URL}/${img.replace(/^\/+/, "")}`;
  };

  /* ================= AUTO LOGIN ================= */
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchHero();
      fetchProducts();
      fetchOrders();
    }
  }, []);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/admin/login`, {
        username,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      setIsLoggedIn(true);
      fetchHero();
      fetchProducts();
      fetchOrders();
    } catch {
      setMessage("Login failed");
    }
  };

  /* ================= HERO ================= */
  const fetchHero = async () => {
    const res = await axios.get(`${BACKEND_URL}/hero`);
    if (res.data) {
      setHeroTitle(res.data.title || "");
      setHeroSubtitle(res.data.subtitle || "");
      setHeroPreview(getImageUrl(res.data.image));
    }
  };

  const updateHero = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", heroTitle);
    formData.append("subtitle", heroSubtitle);
    if (heroImage) formData.append("image", heroImage);

    await axios.post(`${BACKEND_URL}/hero`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessage("✅ Hero updated");
    fetchHero();
  };

  /* ================= PRODUCTS ================= */
  const fetchProducts = async () => {
    const res = await axios.get(`${BACKEND_URL}/products`);
    setProducts(res.data || []);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setProductPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("featured", featured ? "true" : "false");

    // add 1–5 images
    images.forEach((img) => {
      formData.append("images", img);
    });

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    if (editingProductId) {
      await axios.put(`${BACKEND_URL}/products/${editingProductId}`, formData, {
        headers,
      });
      setMessage("✅ Product updated");
    } else {
      await axios.post(`${BACKEND_URL}/products`, formData, { headers });
      setMessage("✅ Product added");
    }

    resetForm();
    fetchProducts();
    setActiveTab("manage");
  };

  const handleEdit = (p) => {
    setEditingProductId(p._id);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price);
    setCategory(p.category);
    setFeatured(p.featured);
    setProductPreviews(p.images?.map(getImageUrl) || []);
    setActiveTab("product");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await axios.delete(`${BACKEND_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImages([]);
    setFeatured(false);
    setEditingProductId(null);
    setProductPreviews([]);
  };

  /* ================= ORDERS ================= */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Order fetch error", err);
      setOrders([]);
    }
  };
  /* CONFIRM ORDER */
  const handleConfirmOrder = async (orderId) => {
    const ok = window.confirm("Confirm this order?");
    if (!ok) return;

    try {
      const res = await axios.put(
        `${BACKEND_URL}/orders/${orderId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
    } catch {
      alert("Confirm failed");
    }
  };

  /* DELETE ORDER */
  const handleDeleteOrder = async (orderId) => {
    const ok = window.confirm("Delete this order?");
    if (!ok) return;

    try {
      await axios.delete(`${BACKEND_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= LOGIN UI ================= */
  if (!isLoggedIn) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <h2 className="text-center mb-3">Admin Login</h2>
            {message && <div className="alert alert-danger">{message}</div>}
            <form onSubmit={handleLogin}>
              <input
                type="file"
                className="form-control mb-2"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              <input
                className="form-control mb-3"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ================= ADMIN UI ================= */
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Admin Panel</h2>

      {/* TABS */}
      <div className="row g-2 mb-4">
        <div className="col-6 col-md-3">
          <button
            className="btn btn-info w-100"
            onClick={() => setActiveTab("hero")}
          >
            Hero
          </button>
        </div>
        <div className="col-6 col-md-3">
          <button
            className="btn btn-primary w-100"
            onClick={() => setActiveTab("product")}
          >
            Add Product
          </button>
        </div>
        <div className="col-6 col-md-3">
          <button
            className="btn btn-secondary w-100"
            onClick={() => setActiveTab("manage")}
          >
            Manage
          </button>
        </div>
        <div className="col-6 col-md-3">
          <button
            className="btn btn-success w-100"
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </div>
      </div>

      {/* HERO */}
      {activeTab === "hero" && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <form onSubmit={updateHero}>
              <input
                className="form-control mb-2"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Hero Title"
              />
              <input
                className="form-control mb-2"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Hero Subtitle"
              />
              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) => {
                  setHeroImage(e.target.files[0]);
                  setHeroPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
              {heroPreview && (
                <img src={heroPreview} className="img-fluid rounded mb-3" />
              )}
              <button className="btn btn-success w-100">Update Hero</button>
            </form>
          </div>
        </div>
      )}
      {/* ADD / EDIT PRODUCT */}
      {activeTab === "product" && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <form onSubmit={handleProductSubmit} className="card p-3 shadow-sm">
              <h5 className="text-center mb-3">
                {editingProductId ? "Update Product" : "Add Product"}
              </h5>

              <input
                className="form-control mb-2"
                placeholder="Product Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                className="form-control mb-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                required
              />

              <input
                className="form-control mb-2"
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <input
                className="form-control mb-2"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
              <input
                type="file"
                className="form-control mb-2"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <div className="d-flex flex-wrap gap-2 mb-2">
                {productPreviews.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                ))}
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  id="featured"
                />
                <label className="form-check-label" htmlFor="featured">
                  Featured Product
                </label>
              </div>

              <button className="btn btn-success w-100">
                {editingProductId ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE PRODUCTS */}
      {activeTab === "manage" && (
        <div className="row g-3">
          {products.map((p) => (
            <div key={p._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <img
                  src={getImageUrl(p.mainImage || p.images?.[0])}
                  className="card-img-top img-fluid"
                />
                <div className="card-body">
                  <h6>{p.title}</h6>
                  <p className="mb-1">Rs.{p.price}</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm w-50"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm w-50"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ORDERS */}
      {activeTab === "orders" && (
        <div className="row g-3">
          {orders.length === 0 && (
            <p className="text-center">No orders found</p>
          )}

          {orders.map((o) => (
            <div key={o._id} className="col-12 col-lg-6">
              <div className="card shadow-sm h-100">
                {/* CARD BODY */}
                <div className="card-body">
                  {/* CUSTOMER INFO */}
                  <div className="mb-3">
                    <h6 className="mb-1 fw-bold">{o.customerName}</h6>

                    <div className="d-flex flex-column gap-1">
                      <small className="text-muted">
                        📧 <span className="ms-1">{o.email}</span>
                      </small>

                      {o.phone && (
                        <small className="text-muted">
                          📞 <span className="ms-1">{o.phone}</span>
                        </small>
                      )}

                      <small className="text-muted">
                        🏠 <span className="ms-1">{o.address}</span>
                      </small>
                    </div>
                  </div>

                  {/* STATUS + ACTIONS */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      className={`badge ${
                        o.status === "Confirmed" ? "bg-success" : "bg-info"
                      }`}
                    >
                      {o.status}
                    </span>

                    <div className="d-flex gap-2">
                      {o.status !== "Confirmed" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleConfirmOrder(o._id)}
                        >
                          Confirm
                        </button>
                      )}

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteOrder(o._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* PRODUCTS */}
                  <ul className="list-group list-group-flush">
                    {(o.products || []).map((p, i) => (
                      <li
                        key={i}
                        className="list-group-item d-flex align-items-center gap-3 px-0"
                      >
                        <img
                          src={getImageUrl(p.image)}
                          alt={p.title}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />

                        <div className="flex-grow-1">
                          <div className="fw-semibold">{p.title}</div>
                          <small className="text-muted">
                            Qty: {p.quantity}
                          </small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* TOTAL */}
                <div className="card-footer bg-white border-top">
                  <div className="d-flex justify-content-end">
                    <strong className="fs-6">Total: Rs.{o.totalAmount}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;

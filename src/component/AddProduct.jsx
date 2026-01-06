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
  const [image, setImage] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productPreview, setProductPreview] = useState(null);

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
    const file = e.target.files[0];
    setImage(file);
    setProductPreview(URL.createObjectURL(file));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("featured", featured);
    if (image) formData.append("image", image);

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
    setProductPreview(getImageUrl(p.image));
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
    setImage(null);
    setFeatured(false);
    setEditingProductId(null);
    setProductPreview(null);
  };

  /* ================= ORDERS ================= */
  const fetchOrders = async () => {
    const res = await axios.get(`${BACKEND_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data || []);
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
                className="form-control mb-2"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
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

      {/* MANAGE PRODUCTS */}
      {activeTab === "manage" && (
        <div className="row g-3">
          {products.map((p) => (
            <div key={p._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <img
                  src={getImageUrl(p.image)}
                  className="card-img-top img-fluid"
                />
                <div className="card-body">
                  <h6>{p.title}</h6>
                  <p className="mb-1">${p.price}</p>
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
          {orders.map((o) => (
            <div key={o._id} className="col-12 col-md-6">
              <div className="card p-3 h-100">
                <strong>{o.customerName}</strong>
                <small>{o.address}</small>
                <ul className="list-group list-group-flush my-2">
                  {o.products.map((p, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex align-items-center"
                    >
                      <img
                        src={getImageUrl(p.image)}
                        width="50"
                        className="me-2 img-fluid"
                      />
                      {p.title} × {p.quantity}
                    </li>
                  ))}
                </ul>
                <strong>Total: ${o.totalAmount}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;

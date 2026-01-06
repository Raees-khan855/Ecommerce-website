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
  const [heroPreview, setHeroPreview] = useState("");

  /* ================= PRODUCTS ================= */
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productPreview, setProductPreview] = useState("");

  /* ================= ORDERS ================= */
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("hero");

  /* ================= IMAGE FIX ================= */
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/300x200?text=No+Image";
    if (img.startsWith("http")) return img;

    const cleanPath = img.replace(/^\/+/, "");
    return `${BACKEND_URL}/${cleanPath}`;
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
    if (!file) return;
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
    setFeatured(p.featured || false);
    setProductPreview(getImageUrl(p.image));
    setImage(null);
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
    setProductPreview("");
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
        {["hero", "product", "manage", "orders"].map((tab) => (
          <div key={tab} className="col-6 col-md-3">
            <button
              className={`btn w-100 btn-${
                tab === "hero"
                  ? "info"
                  : tab === "product"
                  ? "primary"
                  : tab === "manage"
                  ? "secondary"
                  : "success"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          </div>
        ))}
      </div>

      {/* MANAGE PRODUCTS */}
      {activeTab === "manage" && (
        <div className="row g-3">
          {products.map((p) => (
            <div key={p._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <img
                  src={getImageUrl(p.image)}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "contain" }}
                  alt={p.title}
                />
                <div className="card-body">
                  <h6>{p.title}</h6>
                  <p>₹{p.price}</p>
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
    </div>
  );
}

export default AdminPanel;

import React, { useState, useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "../config"; // your config
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  // Login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Product states
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productPreview, setProductPreview] = useState(null);

  // Hero states
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);

  // Active tab
  const [activeTab, setActiveTab] = useState("product");

  // ======================
  // Login handler
  // ======================
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/login`, {
        username,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      setIsLoggedIn(true);
      setMessage("✅ Logged in successfully");
      fetchProducts();
      fetchHero();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Login failed");
    }
  };

  // ======================
  // Fetch products
  // ======================
  const fetchProducts = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get(`${BACKEND_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // Fetch hero
  // ======================
  const fetchHero = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get(`${BACKEND_URL}/api/hero`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setHeroTitle(res.data.title);
        setHeroSubtitle(res.data.subtitle);
        setHeroPreview(res.data.image);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // Image handlers
  // ======================
  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setProductPreview(file ? URL.createObjectURL(file) : null);
  };
  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    setHeroImage(file);
    setHeroPreview(file ? URL.createObjectURL(file) : null);
  };

  // ======================
  // Product submit
  // ======================
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      (!image && !editingProductId)
    ) {
      setMessage("❌ All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);
    formData.append("featured", featured);

    const token = localStorage.getItem("adminToken");
    const url = editingProductId
      ? `${BACKEND_URL}/api/products/${editingProductId}`
      : `${BACKEND_URL}/api/products`;
    const method = editingProductId ? "put" : "post";

    try {
      const res = await axios({
        url,
        method,
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(
        editingProductId ? "✅ Product updated!" : "✅ Product added!"
      );
      fetchProducts();
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage(null);
      setFeatured(false);
      setEditingProductId(null);
      setProductPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error: " + err.message);
    }
  };

  // ======================
  // Delete product
  // ======================
  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${BACKEND_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Product deleted!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error: " + err.message);
    }
  };

  // ======================
  // Hero submit
  // ======================
  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    if (!heroTitle || !heroSubtitle || !heroImage) {
      setMessage("❌ All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", heroTitle);
    formData.append("subtitle", heroSubtitle);
    formData.append("image", heroImage);

    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.post(`${BACKEND_URL}/api/hero`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHeroPreview(res.data.image);
      setMessage("✅ Hero updated!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error: " + err.message);
    }
  };

  // ======================
  // Render
  // ======================
  if (!isLoggedIn) {
    return (
      <div className="container py-5">
        <h2>Admin Login</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Admin Panel</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {/* Tabs */}
      <div className="d-flex gap-2 mb-3">
        <button
          onClick={() => setActiveTab("product")}
          className={`btn ${
            activeTab === "product" ? "btn-primary" : "btn-outline-primary"
          }`}
        >
          Add / Update Product
        </button>
        <button
          onClick={() => setActiveTab("hero")}
          className={`btn ${
            activeTab === "hero" ? "btn-primary" : "btn-outline-primary"
          }`}
        >
          Hero Section
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`btn ${
            activeTab === "manage" ? "btn-primary" : "btn-outline-primary"
          }`}
        >
          Manage Products
        </button>
      </div>
      {/* Product Form */}
      {activeTab === "product" && (
        <form onSubmit={handleProductSubmit} encType="multipart/form-data">
          <input
            className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            className="form-control mb-2"
            type="file"
            accept="image/*"
            onChange={handleProductImageChange}
          />
          {productPreview && (
            <img
              src={productPreview}
              alt="Preview"
              style={{ maxHeight: "150px" }}
            />
          )}
          <div className="form-check mb-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="form-check-input"
            />
            <label className="form-check-label">Featured</label>
          </div>
          <button className="btn btn-success w-100">
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}
      {/* Manage Products */}
      {activeTab === "manage" && (
        <div className="mt-3">
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((p) => (
              <div
                key={p._id}
                className="card mb-2 p-2 d-flex flex-row align-items-center"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  className="me-2"
                />
                <div className="flex-grow-1">
                  <h5>{p.title}</h5>
                  <p>{p.description}</p>
                  <p>
                    ${p.price} | {p.category}
                  </p>
                  {p.featured && (
                    <span className="badge bg-success">Featured</span>
                  )}
                </div>
                <div className="d-flex flex-column gap-1">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                      setEditingProductId(p._id);
                      setTitle(p.title);
                      setDescription(p.description);
                      setPrice(p.price);
                      setCategory(p.category);
                      setFeatured(p.featured);
                      setProductPreview(p.image);
                      setActiveTab("product");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteProduct(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Hero Section */}
      {activeTab === "hero" && (
        <form onSubmit={handleHeroSubmit} encType="multipart/form-data">
          <input
            className="form-control mb-2"
            placeholder="Hero Title"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Hero Subtitle"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
          />
          <input
            className="form-control mb-2"
            type="file"
            accept="image/*"
            onChange={handleHeroImageChange}
          />
          {heroPreview && (
            <img
              src={heroPreview}
              alt="Hero Preview"
              style={{ maxHeight: "150px" }}
            />
          )}
          <button className="btn btn-success w-100">Save Hero</button>
        </form>
      )}
    </div>
  );
}

export default AdminPanel;

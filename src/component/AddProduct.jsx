import React, { useState, useEffect } from "react";
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
    try {
      const res = await fetch(
        "ecommerce-backend-q715w1ypy-raees-khan855s-projects.vercel.app/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        setIsLoggedIn(true);
        setMessage("✅ Logged in successfully");
        fetchProducts();
        fetchHero();
      } else {
        setMessage(data.message || "❌ Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error: " + err.message);
    }
  };

  // ======================
  // Fetch products
  // ======================
  const fetchProducts = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(
        "ecommerce-backend-q715w1ypy-raees-khan855s-projects.vercel.app/api/products",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok || res.status === 200) setProducts(data);
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
      const res = await fetch(
        "ecommerce-backend-q715w1ypy-raees-khan855s-projects.vercel.app/api/hero",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data) {
        setHeroTitle(data.title);
        setHeroSubtitle(data.subtitle);
        setHeroPreview(data.image);
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
  // Product submit (add/update)
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
      ? `ecommerce-backend-q715w1ypy-raees-khan855s-projects.vercel.app/api/products/${editingProductId}`
      : "ecommerce-backend-q715w1ypy-raees-khan855s-projects.vercel.app/api/products";
    const method = editingProductId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
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
      } else {
        setMessage(data.message || "❌ Error saving product");
      }
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
      const res = await fetch(
        `ecommerce-backend-q715w1ypy-raees-khan855s-projects.vercel.app/api/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setMessage("✅ Product deleted!");
        fetchProducts();
      } else {
        const data = await res.json();
        setMessage(data.message || "❌ Failed to delete");
      }
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
      const res = await fetch(
        "ecommerce-backend-q715w1ypy-raees-khan855s-projects.vercel.app/api/hero",
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setHeroPreview(data.image);
        setMessage("✅ Hero updated!");
      } else {
        setMessage(data.message || "❌ Error updating hero");
      }
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

import React, { useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  // Login
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

  const [activeTab, setActiveTab] = useState("product");

  // ======================
  // LOGIN
  // ======================
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${BACKEND_URL}/admin/login`, {
        username,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      setIsLoggedIn(true);
      setMessage("✅ Logged in successfully");
      fetchProducts();
      fetchHero();
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
    }
  };

  // ======================
  // FETCH PRODUCTS
  // ======================
  const fetchProducts = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get(`${BACKEND_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // FETCH HERO
  // ======================
  const fetchHero = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get(`${BACKEND_URL}/hero`, {
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
  // IMAGE HANDLERS
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
  // ADD / UPDATE PRODUCT
  // ======================
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);
    formData.append("featured", featured);

    const token = localStorage.getItem("adminToken");

    try {
      if (editingProductId) {
        await axios.put(
          `${BACKEND_URL}/products/${editingProductId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("✅ Product updated");
      } else {
        await axios.post(`${BACKEND_URL}/products`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Product added");
      }

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
      setMessage("❌ Server error");
    }
  };

  // ======================
  // DELETE PRODUCT
  // ======================
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`${BACKEND_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // HERO SUBMIT
  // ======================
  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const formData = new FormData();
    formData.append("title", heroTitle);
    formData.append("subtitle", heroSubtitle);
    formData.append("image", heroImage);

    try {
      const res = await axios.post(`${BACKEND_URL}/hero`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHeroPreview(res.data.image);
      setMessage("✅ Hero updated");
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  // ======================
  // RENDER
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
            type="password"
            placeholder="Password"
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
          className="btn btn-primary"
        >
          Product
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className="btn btn-primary"
        >
          Manage
        </button>
        <button
          onClick={() => setActiveTab("hero")}
          className="btn btn-primary"
        >
          Hero
        </button>
      </div>

      {activeTab === "product" && (
        <form onSubmit={handleProductSubmit}>
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
            type="number"
            placeholder="Price"
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
            onChange={handleProductImageChange}
          />
          <button className="btn btn-success w-100">
            {editingProductId ? "Update" : "Add"}
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminPanel;

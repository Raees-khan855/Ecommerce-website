import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

// Format WhatsApp number for wa.me
const formatWhatsApp = (num) => {
  if (!num) return "";
  let cleaned = num.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "92" + cleaned.slice(1);
  if (!cleaned.startsWith("92")) cleaned = "92" + cleaned;
  return cleaned; // no '+' for wa.me URL
};

// ---------------- WHATSAPP MESSAGE FUNCTION ----------------
const generateWhatsAppMessage = (customerName, products, totalAmount) => {
  let msg = `🛒 *Hello ${customerName || "Customer"}!*\n\n`;
  msg += `Here are your order details:\n`;

  products.forEach((p, i) => {
    msg += `\n*${i + 1}. ${p.title}*\n`;

    // Add size & color if available
    if (p.selectedSize) msg += `   📏 Size: ${p.selectedSize}\n`;
    if (p.selectedColor) msg += `   🎨 Color: ${p.selectedColor}\n`;

    msg += `   📦 Qty: ${p.quantity}\n`;
    msg += `   💰 Price: Rs.${(p.price * p.quantity).toFixed(2)}\n`;
  });

  // Add total & delivery info
  msg += `\n*💵 Total Amount:* Rs.${totalAmount.toFixed(2)}\n`;
  msg += `⏱️ Delivery: 3-6 days\n`;
  msg += `\nThank you for shopping with us! ❤️`;

  return msg;
};

// ---------------- SEND WHATSAPP ORDER ----------------
const handleSendOrderWhatsApp = (order) => {
  if (!order.whatsapp) return alert("WhatsApp number missing!");

  const phone = formatWhatsApp(order.whatsapp);
  const message = generateWhatsAppMessage(
    order.customerName,
    order.products,
    order.totalAmount,
  );

  // Use encodeURIComponent only on the whole message when opening wa.me
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

function AdminPanel() {
  /* ================= AUTH ================= */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [colorsInput, setColorsInput] = useState(""); // comma separated input
  const [sizesInput, setSizesInput] = useState(""); // comma separated input
  const [editingReviewId, setEditingReviewId] = useState(null);
  const token = localStorage.getItem("adminToken");
  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/faqs`);
      setFaqs(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleFaqSubmit = async (e) => {
    e.preventDefault();

    if (!faqProductId) {
      alert("Please select a product.");
      return;
    }

    // Only save FAQs where both question and answer are entered
    const validFaqs = faqItems
      .map((faq) => ({
        question: faq.question.trim(),
        answer: faq.answer.trim(),
        active: faq.active,
      }))
      .filter((faq) => faq.question && faq.answer);

    if (validFaqs.length === 0) {
      alert("Please enter at least one question and answer.");
      return;
    }

    if (validFaqs.length > 10) {
      alert("Maximum 10 FAQs are allowed.");
      return;
    }

    try {
      const data = {
        productId: faqProductId,
        faqs: validFaqs,
      };

      if (editingFaqId) {
        await axios.put(`${BACKEND_URL}/api/faqs/${editingFaqId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("FAQs updated successfully!");
      } else {
        await axios.post(`${BACKEND_URL}/api/faqs`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("FAQs added successfully!");
      }

      resetFaqForm();
      fetchFaqs();
    } catch (err) {
      console.error("FAQ save error:", err);

      alert(err.response?.data?.message || "Failed to save FAQs.");
    }
  };
  const handleEditFaq = (faq) => {
    setEditingFaqId(faq._id);

    setFaqProductId(
      typeof faq.productId === "object"
        ? faq.productId?._id || ""
        : faq.productId || "",
    );

    const existingFaqs = Array.isArray(faq.faqs) ? faq.faqs : [];

    const formattedFaqs = Array.from(
      { length: 10 },
      (_, index) => existingFaqs[index] || createEmptyFaq(),
    );

    setFaqItems(formattedFaqs);

    setActiveTab("faq");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleDeleteFaq = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/faqs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("FAQ deleted successfully!");

      fetchFaqs();
    } catch (err) {
      console.error("FAQ delete error:", err);

      alert(err.response?.data?.message || "Failed to delete FAQ.");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    await axios.delete(`${BACKEND_URL}/api/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchReviews();
  };
  const handleEditReview = (review) => {
    setEditingReviewId(review._id);

    // productId is populated object
    setReviewProductId(
      typeof review.productId === "object"
        ? review.productId._id
        : review.productId,
    );

    setCustomerName(review.customerName || "");
    setRating(Number(review.rating));
    setComment(review.comment || "");
    setVerified(Boolean(review.verified));

    if (review.image) {
      setReviewImage(null); // keep old image unless user selects new one
    }

    // Open the review form
    setActiveTab("reviews");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  /* ================= HERO ================= */
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("productId", reviewProductId);
    formData.append("customerName", customerName);
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("verified", verified);

    if (reviewImage) {
      formData.append("image", reviewImage);
    }

    try {
      if (editingReviewId) {
        await axios.put(
          `${BACKEND_URL}/api/reviews/${editingReviewId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        alert("Review Updated");
      } else {
        await axios.post(`${BACKEND_URL}/api/reviews`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Review Added");
      }

      setEditingReviewId(null);
      setReviewProductId("");
      setCustomerName("");
      setRating(5);
      setComment("");
      setVerified(true);
      setReviewImage(null);

      fetchReviews();
    } catch (err) {
      console.log(err);
      alert("Failed to save review");
    }
  };
  /*=====Add Review====*/
  const [reviews, setReviews] = useState([]);
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const [reviewProductId, setReviewProductId] = useState("");

  const [customerName, setCustomerName] = useState("");

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [reviewImage, setReviewImage] = useState(null);

  const [verified, setVerified] = useState(true);
  /* ================= FAQ ================= */
  const updateFaqItem = (index, field, value) => {
    setFaqItems((prev) =>
      prev.map((faq, i) =>
        i === index
          ? {
              ...faq,
              [field]: value,
            }
          : faq,
      ),
    );
  };

  const resetFaqForm = () => {
    setFaqProductId("");
    setFaqItems(Array.from({ length: 10 }, createEmptyFaq));
    setEditingFaqId(null);
  };
  const [faqs, setFaqs] = useState([]);

  const [faqProductId, setFaqProductId] = useState("");

  const createEmptyFaq = () => ({
    question: "",
    answer: "",
    active: true,
  });

  const [faqItems, setFaqItems] = useState(
    Array.from({ length: 10 }, createEmptyFaq),
  );
  const [editingFaqId, setEditingFaqId] = useState(null);
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
  /* ===== DRAG & DROP IMAGE HELPERS ===== */
  const fileInputRef = useRef();

  const processFiles = (files) => {
    const selected = Array.from(files).slice(0, 5);
    setImages(selected);
    setProductPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    const newImgs = [...images];
    const newPrev = [...productPreviews];

    newImgs.splice(index, 1);
    newPrev.splice(index, 1);

    setImages(newImgs);
    setProductPreviews(newPrev);
  };
  /* ===== REORDER IMAGES (MOBILE SAFE) ===== */
  const moveImage = (index, direction) => {
    const newPreviews = [...productPreviews];
    const newImages = [...images];

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= newPreviews.length) return;

    // swap previews
    [newPreviews[index], newPreviews[newIndex]] = [
      newPreviews[newIndex],
      newPreviews[index],
    ];

    // swap files only if they exist
    if (newImages.length) {
      [newImages[index], newImages[newIndex]] = [
        newImages[newIndex],
        newImages[index],
      ];
    }

    setProductPreviews(newPreviews);
    setImages(newImages);
  };

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
      fetchReviews();
      fetchFaqs();
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
    const selected = Array.from(e.target.files);

    const newFiles = [...images, ...selected].slice(0, 5);

    setImages(newFiles);
    setProductPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("featured", featured ? "true" : "false");
    formData.append(
      "colors",
      JSON.stringify(
        colorsInput
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
      ),
    );
    formData.append(
      "sizes",
      JSON.stringify(
        sizesInput
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      ),
    );

    images.forEach((img) => {
      formData.append("images", img);
    });

    // ⭐ MUST SEND ORDER
    formData.append("imageOrder", JSON.stringify(productPreviews));

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
    setColorsInput("");
    setSizesInput("");
  };

  const handleEdit = (p) => {
    setEditingProductId(p._id);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price);
    setCategory(p.category);
    setFeatured(p.featured);
    setColorsInput(p.colors?.join(", ") || "");
    setSizesInput(p.sizes?.join(", ") || "");

    // existing server images (no files yet)
    setImages([]);
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

      // Merge updated status with existing order details
      setOrders((prev) =>
        prev.map((o) => {
          if (o._id === orderId) {
            return { ...o, status: res.data.status || "Confirmed" };
          }
          return o;
        }),
      );
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

        <div className="col-6 col-md-3">
          <button
            className="btn btn-dark w-100"
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        <div className="col-6 col-md-3">
          <button
            className="btn btn-primary w-100"
            onClick={() => setActiveTab("faq")}
          >
            FAQ
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
              {/* COLORS */}
              <input
                className="form-control mb-2"
                placeholder="Colors (comma separated, e.g. Red, Blue, White)"
                value={colorsInput}
                onChange={(e) => setColorsInput(e.target.value)}
              />

              {/* SIZES */}
              <input
                className="form-control mb-2"
                placeholder="Sizes (comma separated, e.g. S, M, L, XL)"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
              />

              {/* ===== Drag & Drop Upload ===== */}
              <div
                className="border rounded p-4 text-center mb-3"
                style={{ background: "#fafafa", cursor: "pointer" }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <p className="mb-1">📂 Drag & Drop images here</p>
                <small className="text-muted">or click to browse (max 5)</small>

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="d-flex flex-wrap gap-2 mb-2">
                {productPreviews.map((img, i) => (
                  <div
                    key={i}
                    style={{ position: "relative", textAlign: "center" }}
                  >
                    <img
                      src={img}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: i === 0 ? "3px solid green" : "2px solid #eee",
                      }}
                    />

                    {/* order badge */}
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: 2,
                        background: "#000",
                        color: "#fff",
                        fontSize: 11,
                        padding: "2px 5px",
                        borderRadius: 4,
                      }}
                    >
                      {i + 1}
                    </span>

                    {/* controls */}
                    <div className="d-flex gap-1 mt-1 justify-content-center">
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        onClick={() => moveImage(i, -1)}
                      >
                        ⬆
                      </button>

                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        onClick={() => moveImage(i, 1)}
                      >
                        ⬇
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeImage(i)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
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
      {activeTab === "reviews" && (
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <form onSubmit={handleReviewSubmit} className="card p-3 shadow">
              <h4>Add Review</h4>

              <select
                className="form-select mb-3"
                value={reviewProductId}
                onChange={(e) => setReviewProductId(e.target.value)}
                required
              >
                <option value="">Select Product</option>

                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.title}
                  </option>
                ))}
              </select>

              <input
                className="form-control mb-3"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <select
                className="form-select mb-3"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">★★★★★</option>
                <option value="4">★★★★☆</option>
                <option value="3">★★★☆☆</option>
                <option value="2">★★☆☆☆</option>
                <option value="1">★☆☆☆☆</option>
              </select>

              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <input
                type="file"
                className="form-control mb-3"
                onChange={(e) => setReviewImage(e.target.files[0])}
              />

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />

                <label className="form-check-label">Verified Purchase</label>
              </div>

              <button className="btn btn-success w-100">
                {editingReviewId ? "Update Review" : "Add Review"}
              </button>
            </form>
            <hr className="my-4" />

            <h4>Manage Reviews</h4>

            {reviews.map((review) => {
              const product = products.find((p) => p._id === review.productId);

              return (
                <div key={review._id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <h5>{review.customerName}</h5>

                    <p className="mb-1">
                      Product:
                      <strong>{product?.title || "Deleted Product"}</strong>
                    </p>

                    <p className="mb-1">
                      Rating:
                      {"⭐".repeat(review.rating)}
                    </p>

                    <p>{review.comment}</p>

                    {review.image && (
                      <img
                        src={review.image}
                        width="100"
                        className="rounded mb-2"
                      />
                    )}

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEditReview(review)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* ================= FAQ ================= */}
      {activeTab === "faq" && (
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* FAQ FORM */}
            <form
              onSubmit={handleFaqSubmit}
              className="card p-3 shadow-sm mb-4"
            >
              <h4 className="mb-3">
                {editingFaqId ? "Edit Product FAQs" : "Add Product FAQs"}
              </h4>

              {/* SELECT PRODUCT */}
              <label className="form-label fw-semibold">Select Product</label>

              <select
                className="form-select mb-3"
                value={faqProductId}
                onChange={(e) => setFaqProductId(e.target.value)}
                required
              >
                <option value="">Select a product</option>

                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.title}
                  </option>
                ))}
              </select>

              <p className="text-muted small">
                Add up to 10 questions and answers for this product.
              </p>

              {/* 10 FAQ QUESTIONS */}
              {faqItems.map((faq, index) => (
                <div key={index} className="card mb-3 p-3 border">
                  <h6 className="mb-3">Question {index + 1}</h6>

                  {/* QUESTION */}
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={`Enter question ${index + 1}`}
                    value={faq.question}
                    onChange={(e) =>
                      updateFaqItem(index, "question", e.target.value)
                    }
                  />

                  {/* ANSWER */}
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    placeholder={`Enter answer ${index + 1}`}
                    value={faq.answer}
                    onChange={(e) =>
                      updateFaqItem(index, "answer", e.target.value)
                    }
                  />

                  {/* ACTIVE */}
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`faq-active-${index}`}
                      checked={faq.active}
                      onChange={(e) =>
                        updateFaqItem(index, "active", e.target.checked)
                      }
                    />

                    <label
                      className="form-check-label"
                      htmlFor={`faq-active-${index}`}
                    >
                      Active
                    </label>
                  </div>
                </div>
              ))}

              {/* SUBMIT BUTTON */}
              <button type="submit" className="btn btn-success w-100">
                {editingFaqId ? "Update FAQs" : "Add FAQs"}
              </button>

              {/* CANCEL EDIT */}
              {editingFaqId && (
                <button
                  type="button"
                  className="btn btn-secondary w-100 mt-2"
                  onClick={resetFaqForm}
                >
                  Cancel Edit
                </button>
              )}
            </form>

            {/* FAQ LIST */}
            <div>
              <h3 className="mb-3">Manage FAQs</h3>

              {faqs.length === 0 ? (
                <div className="alert alert-info">No FAQs found.</div>
              ) : (
                faqs.map((faq) => (
                  <div key={faq._id} className="card shadow-sm mb-3">
                    <div className="card-body">
                      {/* PRODUCT */}
                      <div className="mb-2">
                        <span className="badge bg-primary">
                          {faq.productId?.title || "Product FAQ"}
                        </span>
                      </div>

                      {/* QUESTIONS */}
                      {Array.isArray(faq.faqs) &&
                        faq.faqs.map((item, index) => (
                          <div key={index} className="mb-3">
                            <h6 className="mb-1">
                              {index + 1}. {item.question}
                            </h6>

                            <p className="text-muted mb-1">{item.answer}</p>

                            <span
                              className={`badge ${
                                item.active !== false
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {item.active !== false ? "Active" : "Inactive"}
                            </span>
                          </div>
                        ))}

                      {/* ACTIONS */}
                      <div className="d-flex gap-2 mt-3">
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEditFaq(faq)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteFaq(faq._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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
                    <h6 className="mb-1 fw-bold">
                      {o.customerName || "Unknown Customer"}
                    </h6>
                    <div className="d-flex flex-column gap-1">
                      {o.email && (
                        <small className="text-muted">📧 {o.email}</small>
                      )}
                      {o.phone && (
                        <small className="text-muted">📞 {o.phone}</small>
                      )}
                      {o.whatsapp && (
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="text-success">🟢 {o.whatsapp}</span>
                          <button
                            type="button"
                            className="btn p-0"
                            onClick={() => handleSendOrderWhatsApp(o)}
                            title="Send Order on WhatsApp"
                          >
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                              alt="WhatsApp"
                              style={{ width: 20, height: 20 }}
                            />
                          </button>
                        </div>
                      )}
                      {o.address && (
                        <small className="text-muted">🏠 {o.address}</small>
                      )}
                    </div>
                  </div>

                  {/* STATUS + ACTIONS */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      className={`badge ${o.status === "Confirmed" ? "bg-success" : "bg-info"}`}
                    >
                      {o.status || "Pending"}
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

                  {/* PRODUCTS LIST */}
                  <ul className="list-group list-group-flush mb-2">
                    {(o.products || []).map((p, i) => (
                      <li
                        key={i}
                        className="list-group-item d-flex align-items-center gap-3 px-0"
                      >
                        <img
                          src={getImageUrl(p?.image)}
                          alt={p?.title || "Product"}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold">
                            {p?.title || "Unknown Product"}
                          </div>
                          <div className="small text-muted">
                            Qty: {p?.quantity || 0}
                            {p?.selectedSize && (
                              <span className="ms-2">
                                | Size: <b>{p.selectedSize}</b>
                              </span>
                            )}
                            {p?.selectedColor && (
                              <span className="ms-2">
                                | Color: <b>{p.selectedColor}</b>
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="fw-semibold">
                          Rs.
                          {Number((p?.price || 0) * (p?.quantity || 0)).toFixed(
                            2,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* TOTAL AMOUNT */}
                <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center">
                  <strong className="fs-6">
                    Total: Rs.{Number(o?.totalAmount || 0).toFixed(2)}
                  </strong>
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

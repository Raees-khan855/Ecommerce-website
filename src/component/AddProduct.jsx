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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [compareAtPrice, setCompareAtPrice] = useState("");
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
    formData.append("compareAtPrice", compareAtPrice ? compareAtPrice : "");
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
    setCompareAtPrice(p.compareAtPrice || "");
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
    setCompareAtPrice("");
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
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalReviews = reviews.length;
  const totalFaqs = faqs.length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "Confirmed",
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status !== "Confirmed",
  ).length;
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

  /* ================= ADMIN DASHBOARD UI ================= */

  if (!isLoggedIn) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #eef4ff 0%, #f8fafc 50%, #eefbf3 100%)",
        }}
      >
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-6 col-lg-4">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div
                  className="text-white text-center p-4"
                  style={{
                    background: "linear-gradient(135deg, #0d6efd, #084298)",
                  }}
                >
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-white text-primary"
                    style={{
                      width: 70,
                      height: 70,
                      fontSize: 30,
                    }}
                  >
                    🔐
                  </div>

                  <h3 className="fw-bold mb-1">RaeesProduct</h3>

                  <p className="mb-0 opacity-75">Admin Dashboard</p>
                </div>

                <div className="card-body p-4">
                  {message && (
                    <div className="alert alert-danger rounded-3">
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Username</label>

                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Password</label>

                      <input
                        className="form-control form-control-lg rounded-3"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                    >
                      Login to Dashboard
                    </button>
                  </form>
                </div>
              </div>

              <p className="text-center text-muted small mt-3">
                © {new Date().getFullYear()} RaeesProduct
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= MAIN DASHBOARD ================= */

  return (
    <div
      className="min-vh-100"
      style={{
        background: "#f5f7fb",
      }}
    >
      {/* ================= MOBILE TOPBAR ================= */}

      <div
        className="d-lg-none bg-white border-bottom sticky-top"
        style={{ zIndex: 1050 }}
      >
        <div className="d-flex align-items-center justify-content-between p-3">
          <button
            className="btn btn-light rounded-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="fw-bold">RaeesProduct</div>

          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{
              width: 38,
              height: 38,
            }}
          >
            A
          </div>
        </div>
      </div>

      <div className="d-flex">
        {/* ================= SIDEBAR ================= */}

        <aside
          className={`bg-white border-end position-fixed ${
            sidebarOpen ? "d-block" : "d-none"
          } d-lg-flex flex-column`}
          style={{
            width: 250,
            height: "100vh",
            zIndex: 1040,
            top: 0,
            left: 0,
          }}
        >
          {/* LOGO */}

          <div className="p-4 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 45,
                  height: 45,
                  fontSize: 21,
                }}
              >
                R
              </div>

              <div>
                <h5 className="fw-bold mb-0">RaeesProduct</h5>

                <small className="text-muted">Admin Panel</small>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}

          <div className="p-3 flex-grow-1">
            <small className="text-uppercase text-muted fw-bold px-3">
              Management
            </small>

            <div className="mt-2 d-flex flex-column gap-1">
              {[
                ["dashboard", "📊", "Dashboard"],
                ["hero", "🖼️", "Hero"],
                ["product", "➕", "Add Product"],
                ["manage", "📦", "Products"],
                ["orders", "🛒", "Orders"],
                ["reviews", "⭐", "Reviews"],
                ["faq", "❓", "FAQs"],
              ].map(([tab, icon, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setSidebarOpen(false);
                  }}
                  className={`btn text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${
                    activeTab === tab ? "btn-primary" : "btn-light"
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ADMIN */}

          <div className="p-3 border-top">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 40,
                  height: 40,
                }}
              >
                A
              </div>

              <div className="flex-grow-1">
                <div className="fw-semibold">Administrator</div>

                <small className="text-success">● Online</small>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= CONTENT ================= */}

        <main
          className="flex-grow-1"
          style={{
            marginLeft: 0,
          }}
        >
          <div className="container-fluid p-3 p-md-4 p-lg-5">
            {/* HEADER */}

            <div className="d-none d-lg-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="fw-bold mb-1">
                  {activeTab === "dashboard"
                    ? "Dashboard"
                    : activeTab === "hero"
                      ? "Hero Section"
                      : activeTab === "product"
                        ? "Add Product"
                        : activeTab === "manage"
                          ? "Products"
                          : activeTab === "orders"
                            ? "Orders"
                            : activeTab === "reviews"
                              ? "Reviews"
                              : "FAQs"}
                </h2>

                <p className="text-muted mb-0">
                  Manage your store from one place.
                </p>
              </div>

              <div className="d-flex align-items-center gap-3">
                <div className="text-end">
                  <div className="fw-semibold">Administrator</div>

                  <small className="text-success">● Online</small>
                </div>

                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 45,
                    height: 45,
                  }}
                >
                  A
                </div>
              </div>
            </div>

            {/* ================= DASHBOARD ================= */}

            {activeTab === "dashboard" && (
              <>
                {/* STAT CARDS */}

                <div className="row g-3 mb-4">
                  {[
                    {
                      title: "Total Products",
                      value: totalProducts,
                      icon: "📦",
                      color: "primary",
                    },
                    {
                      title: "Total Orders",
                      value: totalOrders,
                      icon: "🛒",
                      color: "success",
                    },
                    {
                      title: "Reviews",
                      value: totalReviews,
                      icon: "⭐",
                      color: "warning",
                    },
                    {
                      title: "FAQs",
                      value: totalFaqs,
                      icon: "❓",
                      color: "info",
                    },
                  ].map((item) => (
                    <div className="col-6 col-xl-3" key={item.title}>
                      <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <p className="text-muted small mb-2">
                                {item.title}
                              </p>

                              <h2 className="fw-bold mb-0">{item.value}</h2>
                            </div>

                            <div
                              className={`bg-${item.color} bg-opacity-10 text-${item.color} rounded-3 d-flex align-items-center justify-content-center`}
                              style={{
                                width: 48,
                                height: 48,
                                fontSize: 22,
                              }}
                            >
                              {item.icon}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ORDER STATUS */}

                <div className="row g-3 mb-4">
                  <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                      <div className="card-body p-4">
                        <h5 className="fw-bold">Order Overview</h5>

                        <p className="text-muted small">Current order status</p>

                        <div className="d-flex justify-content-between mb-3">
                          <span>Confirmed</span>

                          <strong className="text-success">
                            {confirmedOrders}
                          </strong>
                        </div>

                        <div className="progress mb-3" style={{ height: 8 }}>
                          <div
                            className="progress-bar bg-success"
                            style={{
                              width:
                                totalOrders > 0
                                  ? `${(confirmedOrders / totalOrders) * 100}%`
                                  : "0%",
                            }}
                          />
                        </div>

                        <div className="d-flex justify-content-between">
                          <span>Pending</span>

                          <strong className="text-warning">
                            {pendingOrders}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QUICK ACTIONS */}

                  <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                      <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">Quick Actions</h5>

                        <div className="row g-2">
                          <div className="col-6 col-md-3">
                            <button
                              className="btn btn-primary w-100 py-3 rounded-3"
                              onClick={() => setActiveTab("product")}
                            >
                              ➕
                              <br />
                              Product
                            </button>
                          </div>

                          <div className="col-6 col-md-3">
                            <button
                              className="btn btn-success w-100 py-3 rounded-3"
                              onClick={() => setActiveTab("orders")}
                            >
                              🛒
                              <br />
                              Orders
                            </button>
                          </div>

                          <div className="col-6 col-md-3">
                            <button
                              className="btn btn-warning w-100 py-3 rounded-3"
                              onClick={() => setActiveTab("reviews")}
                            >
                              ⭐
                              <br />
                              Reviews
                            </button>
                          </div>

                          <div className="col-6 col-md-3">
                            <button
                              className="btn btn-info w-100 py-3 rounded-3"
                              onClick={() => setActiveTab("faq")}
                            >
                              ❓
                              <br />
                              FAQs
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RECENT ORDERS */}

                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">Recent Orders</h5>

                        <small className="text-muted">
                          Latest customer orders
                        </small>
                      </div>

                      <button
                        className="btn btn-outline-primary btn-sm rounded-pill"
                        onClick={() => setActiveTab("orders")}
                      >
                        View All
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Customer</th>
                            <th>Products</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {orders.slice(0, 5).map((o) => (
                            <tr key={o._id}>
                              <td className="fw-semibold">
                                {o.customerName || "Unknown"}
                              </td>

                              <td>{o.products?.length || 0} item(s)</td>

                              <td>
                                Rs.
                                {Number(o.totalAmount || 0).toLocaleString()}
                              </td>

                              <td>
                                <span
                                  className={`badge rounded-pill ${
                                    o.status === "Confirmed"
                                      ? "bg-success"
                                      : "bg-warning text-dark"
                                  }`}
                                >
                                  {o.status || "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}

                          {orders.length === 0 && (
                            <tr>
                              <td
                                colSpan="4"
                                className="text-center text-muted py-4"
                              >
                                No orders found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ================= HERO ================= */}

            {activeTab === "hero" && (
              <div className="row justify-content-center">
                <div className="col-12 col-xl-8">
                  <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4 p-md-5">
                      <div className="mb-4">
                        <h4 className="fw-bold">Hero Section</h4>

                        <p className="text-muted mb-0">
                          Update the main banner displayed on your store.
                        </p>
                      </div>

                      <form onSubmit={updateHero}>
                        <label className="form-label fw-semibold">
                          Hero Title
                        </label>

                        <input
                          className="form-control form-control-lg rounded-3 mb-3"
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                          placeholder="Hero Title"
                        />

                        <label className="form-label fw-semibold">
                          Hero Subtitle
                        </label>

                        <input
                          className="form-control form-control-lg rounded-3 mb-3"
                          value={heroSubtitle}
                          onChange={(e) => setHeroSubtitle(e.target.value)}
                          placeholder="Hero Subtitle"
                        />

                        <label className="form-label fw-semibold">
                          Hero Image
                        </label>

                        <input
                          type="file"
                          className="form-control rounded-3 mb-3"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];

                            if (!file) return;

                            setHeroImage(file);
                            setHeroPreview(URL.createObjectURL(file));
                          }}
                        />

                        {heroPreview && (
                          <div className="mb-4">
                            <img
                              src={heroPreview}
                              alt="Hero preview"
                              className="img-fluid rounded-4 border"
                              style={{
                                maxHeight: 350,
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}

                        <button className="btn btn-success btn-lg w-100 rounded-3">
                          Update Hero
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= ADD PRODUCT ================= */}

            {activeTab === "product" && (
              <div className="row justify-content-center">
                <div className="col-12 col-xl-9">
                  <form
                    onSubmit={handleProductSubmit}
                    className="card border-0 shadow-sm rounded-4"
                  >
                    <div className="card-body p-4 p-md-5">
                      <div className="mb-4">
                        <h4 className="fw-bold">
                          {editingProductId
                            ? "Update Product"
                            : "Add New Product"}
                        </h4>

                        <p className="text-muted mb-0">
                          Add product details, pricing, variants and images.
                        </p>
                      </div>

                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            Product Title
                          </label>

                          <input
                            className="form-control rounded-3"
                            placeholder="Product Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            Description
                          </label>

                          <textarea
                            className="form-control rounded-3"
                            placeholder="Product Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="5"
                            required
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Price
                          </label>

                          <div className="input-group">
                            <span className="input-group-text">Rs.</span>

                            <input
                              className="form-control"
                              type="number"
                              placeholder="2500"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Compare-at Price
                          </label>

                          <div className="input-group">
                            <span className="input-group-text">Rs.</span>

                            <input
                              className="form-control"
                              type="number"
                              placeholder="3500"
                              value={compareAtPrice}
                              onChange={(e) =>
                                setCompareAtPrice(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            Category
                          </label>

                          <select
                            className="form-select rounded-3"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                          >
                            <option value="">Select Category</option>
                            <option value="watch">Watches</option>
                            <option value="earbuds">Earbuds</option>
                            <option value="beauty">Beauty</option>
                            <option value="electronics">Electronics</option>
                          </select>
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Colors
                          </label>

                          <input
                            className="form-control rounded-3"
                            placeholder="Red, Blue, White"
                            value={colorsInput}
                            onChange={(e) => setColorsInput(e.target.value)}
                          />

                          <small className="text-muted">
                            Separate colors with commas.
                          </small>
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Sizes
                          </label>

                          <input
                            className="form-control rounded-3"
                            placeholder="S, M, L, XL"
                            value={sizesInput}
                            onChange={(e) => setSizesInput(e.target.value)}
                          />

                          <small className="text-muted">
                            Separate sizes with commas.
                          </small>
                        </div>

                        {/* IMAGE UPLOAD */}

                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            Product Images
                          </label>

                          <div
                            className="border border-2 rounded-4 text-center p-5"
                            style={{
                              borderStyle: "dashed",
                              cursor: "pointer",
                              background: "#fafbfc",
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div
                              style={{
                                fontSize: 40,
                              }}
                            >
                              📸
                            </div>

                            <h6 className="fw-bold mt-2">
                              Upload Product Images
                            </h6>

                            <p className="text-muted small mb-0">
                              Drag & drop images here or click to browse
                            </p>

                            <small className="text-muted">
                              Maximum 5 images
                            </small>

                            <input
                              ref={fileInputRef}
                              type="file"
                              hidden
                              multiple
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </div>
                        </div>

                        {/* PREVIEWS */}

                        {productPreviews.length > 0 && (
                          <div className="col-12">
                            <div className="row g-3">
                              {productPreviews.map((img, i) => (
                                <div
                                  className="col-6 col-sm-4 col-md-3"
                                  key={i}
                                >
                                  <div className="card border-0 shadow-sm overflow-hidden rounded-4">
                                    <div
                                      style={{
                                        position: "relative",
                                      }}
                                    >
                                      <img
                                        src={img}
                                        alt={`Product ${i + 1}`}
                                        className="w-100"
                                        style={{
                                          height: 130,
                                          objectFit: "cover",
                                        }}
                                      />

                                      <span className="badge bg-dark position-absolute top-0 start-0 m-2">
                                        {i + 1}
                                      </span>

                                      {i === 0 && (
                                        <span className="badge bg-success position-absolute bottom-0 start-0 m-2">
                                          Main
                                        </span>
                                      )}
                                    </div>

                                    <div className="p-2">
                                      <div className="d-flex gap-1">
                                        <button
                                          type="button"
                                          className="btn btn-light btn-sm flex-fill"
                                          onClick={() => moveImage(i, -1)}
                                        >
                                          ⬆
                                        </button>

                                        <button
                                          type="button"
                                          className="btn btn-light btn-sm flex-fill"
                                          onClick={() => moveImage(i, 1)}
                                        >
                                          ⬇
                                        </button>

                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm flex-fill"
                                          onClick={() => removeImage(i)}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* FEATURED */}

                        <div className="col-12">
                          <div className="form-check form-switch p-3 bg-light rounded-3">
                            <input
                              className="form-check-input ms-0 me-2"
                              type="checkbox"
                              checked={featured}
                              onChange={(e) => setFeatured(e.target.checked)}
                              id="featured"
                            />

                            <label
                              className="form-check-label fw-semibold"
                              htmlFor="featured"
                            >
                              ⭐ Featured Product
                            </label>
                          </div>
                        </div>

                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-success btn-lg w-100 rounded-3 fw-semibold"
                          >
                            {editingProductId
                              ? "Update Product"
                              : "Add Product"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ================= MANAGE PRODUCTS ================= */}

            {activeTab === "manage" && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold mb-1">Products</h4>

                    <small className="text-muted">
                      {products.length} products in your store
                    </small>
                  </div>

                  <button
                    className="btn btn-primary rounded-3"
                    onClick={() => setActiveTab("product")}
                  >
                    + Add Product
                  </button>
                </div>

                <div className="row g-4">
                  {products.map((p) => (
                    <div key={p._id} className="col-12 col-sm-6 col-xl-4">
                      <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <img
                          src={getImageUrl(p.mainImage || p.images?.[0])}
                          alt={p.title}
                          className="w-100"
                          style={{
                            height: 220,
                            objectFit: "cover",
                          }}
                        />

                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <h6 className="fw-bold mb-2">{p.title}</h6>

                            {p.featured && (
                              <span className="badge bg-warning text-dark">
                                Featured
                              </span>
                            )}
                          </div>

                          <div className="text-muted small mb-2">
                            {p.category}
                          </div>

                          <div className="fw-bold text-primary fs-5 mb-3">
                            Rs.
                            {Number(p.price || 0).toLocaleString()}
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-warning flex-fill rounded-3"
                              onClick={() => handleEdit(p)}
                            >
                              ✏️ Edit
                            </button>

                            <button
                              className="btn btn-outline-danger flex-fill rounded-3"
                              onClick={() => handleDelete(p._id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {products.length === 0 && (
                    <div className="col-12">
                      <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body text-center py-5">
                          <div style={{ fontSize: 50 }}>📦</div>

                          <h5 className="fw-bold mt-3">No products yet</h5>

                          <p className="text-muted">
                            Add your first product to get started.
                          </p>

                          <button
                            className="btn btn-primary rounded-pill px-4"
                            onClick={() => setActiveTab("product")}
                          >
                            Add Product
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ================= ORDERS ================= */}

            {activeTab === "orders" && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold mb-1">Orders</h4>

                    <small className="text-muted">
                      {orders.length} total orders
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                      Pending: {pendingOrders}
                    </span>

                    <span className="badge bg-success rounded-pill px-3 py-2">
                      Confirmed: {confirmedOrders}
                    </span>
                  </div>
                </div>

                <div className="row g-4">
                  {orders.map((o) => (
                    <div key={o._id} className="col-12 col-xl-6">
                      <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                          {/* CUSTOMER */}

                          <div className="d-flex justify-content-between gap-3 mb-3">
                            <div>
                              <h5 className="fw-bold mb-1">
                                {o.customerName || "Unknown Customer"}
                              </h5>

                              <div className="small text-muted">
                                Order #{o._id?.slice(-6)}
                              </div>
                            </div>

                            <span
                              className={`badge align-self-start rounded-pill ${
                                o.status === "Confirmed"
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {o.status || "Pending"}
                            </span>
                          </div>

                          <div className="bg-light rounded-3 p-3 mb-3">
                            <div className="small mb-2">
                              📧 {o.email || "No email"}
                            </div>

                            <div className="small mb-2">
                              📞 {o.phone || "No phone"}
                            </div>

                            {o.whatsapp && (
                              <div className="d-flex align-items-center gap-2 small">
                                🟢 {o.whatsapp}
                                <button
                                  type="button"
                                  className="btn btn-sm btn-success rounded-pill"
                                  onClick={() => handleSendOrderWhatsApp(o)}
                                >
                                  WhatsApp
                                </button>
                              </div>
                            )}

                            <div className="small mt-2">
                              🏠 {o.address || "No address"}
                            </div>
                          </div>

                          {/* PRODUCTS */}

                          <h6 className="fw-bold mb-3">Order Items</h6>

                          <div className="d-flex flex-column gap-2">
                            {(o.products || []).map((p, i) => (
                              <div
                                key={i}
                                className="d-flex align-items-center gap-3 border rounded-3 p-2"
                              >
                                <img
                                  src={getImageUrl(p?.image)}
                                  alt={p?.title || "Product"}
                                  style={{
                                    width: 55,
                                    height: 55,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                  }}
                                />

                                <div className="flex-grow-1">
                                  <div className="fw-semibold">
                                    {p?.title || "Unknown Product"}
                                  </div>

                                  <small className="text-muted">
                                    Qty: {p?.quantity || 0}
                                    {p?.selectedSize &&
                                      ` • Size: ${p.selectedSize}`}
                                    {p?.selectedColor &&
                                      ` • Color: ${p.selectedColor}`}
                                  </small>
                                </div>

                                <div className="fw-semibold">
                                  Rs.
                                  {Number(
                                    (p?.price || 0) * (p?.quantity || 0),
                                  ).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* FOOTER */}

                          <div className="border-top mt-3 pt-3 d-flex justify-content-between align-items-center">
                            <strong>Total</strong>

                            <strong className="fs-5 text-primary">
                              Rs.
                              {Number(o.totalAmount || 0).toLocaleString()}
                            </strong>
                          </div>

                          <div className="d-flex gap-2 mt-3">
                            {o.status !== "Confirmed" && (
                              <button
                                className="btn btn-success flex-fill rounded-3"
                                onClick={() => handleConfirmOrder(o._id)}
                              >
                                ✓ Confirm
                              </button>
                            )}

                            <button
                              className="btn btn-outline-danger flex-fill rounded-3"
                              onClick={() => handleDeleteOrder(o._id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <div className="col-12">
                      <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body text-center py-5">
                          <div style={{ fontSize: 50 }}>🛒</div>

                          <h5 className="fw-bold mt-3">No orders found</h5>

                          <p className="text-muted mb-0">
                            New orders will appear here.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ================= REVIEWS ================= */}

            {activeTab === "reviews" && (
              <div className="row g-4">
                <div className="col-12 col-xl-5">
                  <form
                    onSubmit={handleReviewSubmit}
                    className="card border-0 shadow-sm rounded-4"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-1">
                        {editingReviewId ? "Edit Review" : "Add Review"}
                      </h4>

                      <p className="text-muted small mb-4">
                        Add customer feedback to your products.
                      </p>

                      <select
                        className="form-select rounded-3 mb-3"
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
                        className="form-control rounded-3 mb-3"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />

                      <select
                        className="form-select rounded-3 mb-3"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="5">⭐⭐⭐⭐⭐</option>
                        <option value="4">⭐⭐⭐⭐☆</option>
                        <option value="3">⭐⭐⭐☆☆</option>
                        <option value="2">⭐⭐☆☆☆</option>
                        <option value="1">⭐☆☆☆☆</option>
                      </select>

                      <textarea
                        className="form-control rounded-3 mb-3"
                        rows="5"
                        placeholder="Customer Review"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />

                      <input
                        type="file"
                        className="form-control rounded-3 mb-3"
                        accept="image/*"
                        onChange={(e) => setReviewImage(e.target.files[0])}
                      />

                      <div className="form-check form-switch mb-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={verified}
                          onChange={(e) => setVerified(e.target.checked)}
                        />

                        <label className="form-check-label fw-semibold">
                          Verified Purchase
                        </label>
                      </div>

                      <button className="btn btn-success w-100 rounded-3">
                        {editingReviewId ? "Update Review" : "Add Review"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="col-12 col-xl-7">
                  <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4">Customer Reviews</h4>

                      <div className="d-flex flex-column gap-3">
                        {reviews.map((review) => {
                          const product = products.find(
                            (p) => p._id === review.productId,
                          );

                          return (
                            <div
                              key={review._id}
                              className="border rounded-4 p-3"
                            >
                              <div className="d-flex justify-content-between gap-3">
                                <div>
                                  <h6 className="fw-bold mb-1">
                                    {review.customerName}
                                  </h6>

                                  <div className="text-warning">
                                    {"⭐".repeat(review.rating)}
                                  </div>
                                </div>

                                {review.verified && (
                                  <span className="badge bg-success rounded-pill align-self-start">
                                    ✓ Verified
                                  </span>
                                )}
                              </div>

                              <small className="text-muted d-block mt-2">
                                {product?.title || "Deleted Product"}
                              </small>

                              <p className="mt-2 mb-2">{review.comment}</p>

                              {review.image && (
                                <img
                                  src={review.image}
                                  alt="Review"
                                  width="90"
                                  height="90"
                                  className="rounded-3 object-fit-cover mb-2"
                                />
                              )}

                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-warning btn-sm rounded-3"
                                  onClick={() => handleEditReview(review)}
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  className="btn btn-outline-danger btn-sm rounded-3"
                                  onClick={() => handleDeleteReview(review._id)}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {reviews.length === 0 && (
                          <div className="text-center py-5 text-muted">
                            No reviews found.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= FAQ ================= */}

            {activeTab === "faq" && (
              <div className="row g-4">
                <div className="col-12 col-xl-7">
                  <form
                    onSubmit={handleFaqSubmit}
                    className="card border-0 shadow-sm rounded-4"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-1">
                        {editingFaqId ? "Edit FAQs" : "Add Product FAQs"}
                      </h4>

                      <p className="text-muted small mb-4">
                        Add up to 10 questions and answers.
                      </p>

                      <select
                        className="form-select rounded-3 mb-4"
                        value={faqProductId}
                        onChange={(e) => setFaqProductId(e.target.value)}
                        required
                      >
                        <option value="">Select Product</option>

                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.title}
                          </option>
                        ))}
                      </select>

                      {faqItems.map((faq, index) => (
                        <div key={index} className="border rounded-4 p-3 mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <h6 className="fw-bold mb-0">
                              Question {index + 1}
                            </h6>

                            <span className="badge bg-light text-dark">
                              {index + 1}/10
                            </span>
                          </div>

                          <input
                            type="text"
                            className="form-control rounded-3 mb-2"
                            placeholder={`Enter question ${index + 1}`}
                            value={faq.question}
                            onChange={(e) =>
                              updateFaqItem(index, "question", e.target.value)
                            }
                          />

                          <textarea
                            className="form-control rounded-3 mb-2"
                            rows="3"
                            placeholder={`Enter answer ${index + 1}`}
                            value={faq.answer}
                            onChange={(e) =>
                              updateFaqItem(index, "answer", e.target.value)
                            }
                          />

                          <div className="form-check form-switch">
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

                      <button
                        type="submit"
                        className="btn btn-success w-100 rounded-3"
                      >
                        {editingFaqId ? "Update FAQs" : "Save FAQs"}
                      </button>

                      {editingFaqId && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary w-100 rounded-3 mt-2"
                          onClick={resetFaqForm}
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* FAQ LIST */}

                <div className="col-12 col-xl-5">
                  <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4">Manage FAQs</h4>

                      <div className="d-flex flex-column gap-3">
                        {faqs.map((faq) => (
                          <div key={faq._id} className="border rounded-4 p-3">
                            <span className="badge bg-primary rounded-pill mb-3">
                              {faq.productId?.title || "Product FAQ"}
                            </span>

                            {Array.isArray(faq.faqs) &&
                              faq.faqs.map((item, index) => (
                                <div key={index} className="mb-3">
                                  <div className="fw-semibold">
                                    {index + 1}. {item.question}
                                  </div>

                                  <p className="text-muted small mb-1 mt-1">
                                    {item.answer}
                                  </p>

                                  <span
                                    className={`badge ${
                                      item.active !== false
                                        ? "bg-success"
                                        : "bg-secondary"
                                    }`}
                                  >
                                    {item.active !== false
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </div>
                              ))}

                            <div className="d-flex gap-2 mt-3">
                              <button
                                type="button"
                                className="btn btn-warning btn-sm rounded-3 flex-fill"
                                onClick={() => handleEditFaq(faq)}
                              >
                                ✏️ Edit
                              </button>

                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm rounded-3 flex-fill"
                                onClick={() => handleDeleteFaq(faq._id)}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        ))}

                        {faqs.length === 0 && (
                          <div className="text-center text-muted py-4">
                            No FAQs found.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;

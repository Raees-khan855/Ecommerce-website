import { useState } from "react";
import useSEO from "../hooks/useSEO";
import {
  FaUser,
  FaEnvelope,
  FaCommentDots,
  FaPaperPlane,
} from "react-icons/fa";
import BACKEND_URL from "../config";

const Contact = () => {
  useSEO({
    title: "Contact Us | MyShop",
    description:
      "Contact MyShop for support, orders, and inquiries. We are happy to help.",
    url: window.location.href,
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    setSuccess(false);

    try {
      const res = await fetch(`${BACKEND_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setStatus("Message sent successfully! We will contact you soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(data.message || "Something went wrong.");
      }
    } catch {
      setStatus("Server error. Try again later.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-4 p-md-5">
              <h2 className="fw-bold text-center mb-2">Contact Us</h2>
              <p className="text-center text-muted mb-4">
                Have a question? We’d love to hear from you.
              </p>

              {/* STATUS MESSAGE */}
              {status && (
                <div
                  className={`alert ${
                    success ? "alert-success" : "alert-info"
                  } text-center`}
                >
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* NAME */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Message</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light align-items-start">
                      <FaCommentDots />
                    </span>
                    <textarea
                      className="form-control"
                      name="message"
                      placeholder="Write your message..."
                      rows="4"
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                >
                  <FaPaperPlane />
                  Send Message
                </button>
              </form>

              <p className="text-center text-muted mt-4 mb-0">
                We usually respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

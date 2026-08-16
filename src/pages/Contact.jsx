import { useState, useCallback } from "react";
import useSEO from "../hooks/useSEO";
import {
  FaUser,
  FaEnvelope,
  FaCommentDots,
  FaPaperPlane,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import BACKEND_URL from "../config";

const Contact = () => {
  useSEO({
    title: "Contact Us | RaeesProduct",
    description:
      "Contact RaeesProduct for support, orders, and inquiries. We are happy to help.",
    url: window.location.href,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (submitting) return;

      setSubmitting(true);
      setStatus("Sending...");
      setSuccess(false);

      try {
        const res = await fetch(`${BACKEND_URL}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
          if (window.ttq) {
            window.ttq.track("Lead", {
              content_name: "Contact Form",
              content_type: "contact",
            });
          }

          setSuccess(true);
          setStatus("Message sent successfully! We will contact you soon.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        } else {
          setStatus(data.message || "Something went wrong.");
        }
      } catch {
        setStatus("Server error. Please try again later.");
      } finally {
        setSubmitting(false);
      }
    },
    [form, submitting],
  );

  return (
    <div
      className="py-5"
      style={{
        minHeight: "calc(100vh - 70px)",
        background:
          "linear-gradient(135deg, #f8faff 0%, #eef4ff 50%, #ffffff 100%)",
      }}
    >
      <div className="container">
        {/* HEADER */}
        <div className="text-center mb-5">
          <span
            className="badge rounded-pill px-3 py-2 mb-3"
            style={{
              background: "#e8f0ff",
              color: "#0d6efd",
              fontWeight: 600,
            }}
          >
            GET IN TOUCH
          </span>

          <h1 className="fw-bold display-6 mb-2">
            Contact <span className="text-primary">Us</span>
          </h1>

          <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>
            Have a question about your order or our products? Send us a message
            and our team will be happy to help.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* LEFT INFO */}
          <div className="col-12 col-lg-4">
            <div
              className="h-100 rounded-4 p-4 p-md-5 text-white shadow-lg"
              style={{
                background: "linear-gradient(145deg, #0d6efd, #084298)",
              }}
            >
              <h3 className="fw-bold mb-3">We'd love to hear from you.</h3>

              <p className="mb-4 opacity-75">
                Whether you have a question about a product, your order, or
                anything else, feel free to contact us.
              </p>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/923254555681"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-white"
              >
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 48,
                      height: 48,
                      background: "rgba(255,255,255,.15)",
                    }}
                  >
                    <FaWhatsapp size={22} />
                  </div>

                  <div>
                    <div className="small opacity-75">WhatsApp</div>
                    <strong>+92 325 4555681</strong>
                  </div>
                </div>
              </a>

              {/* LOCATION */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(255,255,255,.15)",
                  }}
                >
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <div className="small opacity-75">Location</div>
                  <strong>Pakistan</strong>
                </div>
              </div>

              {/* RESPONSE */}
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(255,255,255,.15)",
                  }}
                >
                  <FaClock />
                </div>

                <div>
                  <div className="small opacity-75">Response Time</div>
                  <strong>Within 24 hours</strong>
                </div>
              </div>

              <hr
                className="my-4"
                style={{ borderColor: "rgba(255,255,255,.2)" }}
              />

              <p className="small opacity-75 mb-0">
                Your message is important to us. We will try our best to respond
                as quickly as possible.
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="col-12 col-lg-7">
            <div
              className="bg-white rounded-4 shadow-lg p-4 p-md-5"
              style={{
                border: "1px solid #eef1f5",
              }}
            >
              <div className="mb-4">
                <h3 className="fw-bold mb-1">Send us a message</h3>

                <p className="text-muted mb-0">
                  Fill in the form below and we'll get back to you.
                </p>
              </div>

              {/* STATUS */}
              {status && (
                <div
                  className={`alert ${
                    success
                      ? "alert-success"
                      : status === "Sending..."
                        ? "alert-info"
                        : "alert-danger"
                  } border-0 rounded-3`}
                >
                  {success && "✓ "}
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* NAME */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Your Name</label>

                  <div
                    className="input-group"
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <span
                      className="input-group-text border-end-0"
                      style={{
                        background: "#f8faff",
                        color: "#0d6efd",
                      }}
                    >
                      <FaUser />
                    </span>

                    <input
                      type="text"
                      className="form-control border-start-0 py-3"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <div
                    className="input-group"
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <span
                      className="input-group-text border-end-0"
                      style={{
                        background: "#f8faff",
                        color: "#0d6efd",
                      }}
                    >
                      <FaEnvelope />
                    </span>

                    <input
                      type="email"
                      className="form-control border-start-0 py-3"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Message</label>

                  <div
                    className="input-group"
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <span
                      className="input-group-text border-end-0 align-items-start pt-3"
                      style={{
                        background: "#f8faff",
                        color: "#0d6efd",
                      }}
                    >
                      <FaCommentDots />
                    </span>

                    <textarea
                      className="form-control border-start-0"
                      name="message"
                      rows="5"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                      style={{
                        resize: "vertical",
                      }}
                    />
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-100 py-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  style={{
                    transition: "all .2s ease",
                  }}
                >
                  <FaPaperPlane />

                  {submitting ? "Sending Message..." : "Send Message"}
                </button>
              </form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  🔒 Your information is only used to respond to your inquiry.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM NOTE */}
        <div className="text-center mt-5">
          <p className="text-muted small mb-0">
            We usually respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

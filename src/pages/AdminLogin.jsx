import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../config";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("⚠️ Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BACKEND_URL}/admin/login`,
        {
          username: username.trim(),
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // ✅ Save token
      localStorage.setItem("adminToken", res.data.token);

      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "❌ Invalid credentials or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h3 className="text-center fw-bold mb-3">🔐 Admin Login</h3>

            {error && (
              <div className="alert alert-danger py-2 text-center">{error}</div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

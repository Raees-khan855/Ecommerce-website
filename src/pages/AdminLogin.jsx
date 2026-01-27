import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import BACKEND_URL from "../config";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use useCallback to avoid recreating function on every render
  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      if (!username || !password) {
        setError("Please enter username and password");
        return;
      }

      try {
        setLoading(true);
        const res = await axios.post(`${BACKEND_URL}/admin/login`, {
          username,
          password,
        });

        localStorage.setItem("adminToken", res.data.token);
        dispatch(loginSuccess(res.data.user));

        navigate("/admin");
      } catch (err) {
        setError(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    },
    [username, password, dispatch, navigate],
  );

  return (
    <div className="container py-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4 text-center">Admin Login</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleLogin}>
        <input
          className="form-control mb-3"
          name="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          required
        />
        <input
          className="form-control mb-3"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

// Lazy load for PageSpeed if this is part of a bigger app
export default React.memo(AdminLogin);

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://ecommerce-backend-q715w1ypy-raees-khan855s-projects.vercel.app/api/admin/login", // your backend URL
        { username, password },
        { headers: { "Content-Type": "application/json" } } // headers go here
      );

      // save token
      localStorage.setItem("adminToken", res.data.token);

      alert("✅ Logged in successfully");

      navigate("/AdminPanel"); // redirect to admin panel
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "❌ Invalid credentials or server error"
      );
    }
  };

  return (
    <div className="container py-5">
      <h2>Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          className="form-control mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;

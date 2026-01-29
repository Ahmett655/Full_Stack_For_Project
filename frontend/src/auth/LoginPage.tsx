import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthProvider";

type LoginRes = {
  token: string;
  user: { _id: string; email: string; name?: string; role: "user" | "admin" };
};

export default function LoginPage() {
  const nav = useNavigate();
  const { setAuth, toggleTheme, theme } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post<LoginRes>("/api/auth/login", { email, password });
      setAuth(res.data.token, res.data.user);
      nav(res.data.user.role === "admin" ? "/app/admin/dashboard" : "/app/user/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card glass">
        <div className="auth-left">
          <div className="top-actions" style={{ justifyContent: "flex-end" }}>
            <button className="btn" onClick={toggleTheme}>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
          <h1>Welcome Back</h1>
          <p>
            Login to manage your license requests, payments, and download your card after approval.
          </p>
          <div className="hr"></div>
          <p className="muted">
            Tip: Use your registered email & password. Admin accounts will be redirected to admin dashboard.
          </p>
        </div>

        <div className="auth-right">
          <h2 style={{ marginTop: 0 }}>Login</h2>

          {err && <div className="alert alert-error">{err}</div>}

          <form className="form" onSubmit={submit}>
            <div className="field">
              <label>Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>

            <div className="field">
              <label>Password</label>
              <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            </div>

            <button className="btn btn-primary" disabled={loading} type="submit">
              {loading ? (<><span className="loader" /> Logging in...</>) : "Login"}
            </button>

            <div className="auth-links">
              <span className="muted">Don’t have an account?</span>
              <Link className="link" to="/register">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

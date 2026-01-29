import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthProvider";

type RegisterRes = {
  token: string;
  user: { _id: string; email: string; name?: string; role: "user" | "admin" };
};

export default function RegisterPage() {
  const nav = useNavigate();
  const { setAuth } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await api.post<RegisterRes>("/api/auth/register", {
        name,
        email,
        password,
      });

      // auto-login after register
      setAuth(res.data.token, res.data.user);

      nav(res.data.user.role === "admin" ? "/app/admin/dashboard" : "/app/user/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2 className="auth-title">Register</h2>

        {err && <div className="alert alert-error">{err}</div>}

        <form className="form" onSubmit={submit}>
          <div className="form-row">
            <label className="label">Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
            />
          </div>

          <div className="form-row">
            <label className="label">Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div className="form-row">
            <label className="label">Password</label>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
            />
            <div className="hint">Password must be at least 6 characters.</div>
          </div>

          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={{ marginTop: 14, textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

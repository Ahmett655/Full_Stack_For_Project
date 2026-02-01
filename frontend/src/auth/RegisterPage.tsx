import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api"; // ✅ named export
import { useAuth } from "../context/AuthProvider";

type RegisterResponse = {
  token: string;
  user: { _id: string; name: string; email: string; role: "user" | "admin" };
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // same theme behavior as LoginPage
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const passwordOk = password.length >= 6;

  const S = useMemo(() => {
    const bg = dark
      ? "radial-gradient(900px 500px at 20% 10%, rgba(34,197,94,0.22), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(59,130,246,0.18), transparent 60%), linear-gradient(180deg,#020617,#0b1225)"
      : "radial-gradient(900px 500px at 20% 10%, rgba(59,130,246,0.20), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(34,197,94,0.18), transparent 60%), linear-gradient(180deg,#f8fafc,#eef2ff)";

    const cardBg = dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.95)";
    const border = dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.10)";
    const text = dark ? "#fff" : "#0f172a";
    const sub = dark ? "rgba(226,232,240,0.80)" : "rgba(51,65,85,0.85)";
    const inputBg = dark ? "rgba(2,6,23,0.35)" : "#fff";
    const inputBorder = dark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.12)";

    return {
      page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: bg,
        transition: "0.35s",
      } as React.CSSProperties,
      card: {
        width: "100%",
        maxWidth: 420,
        borderRadius: 20,
        padding: 26,
        background: cardBg,
        border: `1px solid ${border}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        backdropFilter: "blur(14px)",
      } as React.CSSProperties,
      title: {
        margin: 0,
        textAlign: "center",
        fontSize: 22,
        fontWeight: 900,
        color: text,
      } as React.CSSProperties,
      sub: {
        marginTop: 6,
        textAlign: "center",
        fontSize: 13,
        fontWeight: 700,
        color: sub,
        marginBottom: 18,
      } as React.CSSProperties,
      field: { position: "relative", marginBottom: 12 } as React.CSSProperties,
      icon: {
        position: "absolute",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: 16,
        opacity: 0.75,
        transition: "0.25s",
      } as React.CSSProperties,
      input: {
        width: "100%",
        padding: "14px 14px 14px 42px",
        borderRadius: 12,
        border: `1px solid ${inputBorder}`,
        outline: "none",
        fontSize: 14,
        background: inputBg,
        color: text,
      } as React.CSSProperties,
      hint: {
        marginTop: -6,
        marginBottom: 10,
        fontSize: 12,
        fontWeight: 800,
        color: sub,
      } as React.CSSProperties,
      btn: {
        width: "100%",
        padding: 14,
        borderRadius: 12,
        border: "none",
        background: "linear-gradient(135deg,#22c55e,#16a34a)",
        color: "#fff",
        fontWeight: 900,
        fontSize: 15,
        cursor: "pointer",
        marginTop: 8,
      } as React.CSSProperties,
      btnDisabled: {
        opacity: 0.7,
        cursor: "not-allowed",
      } as React.CSSProperties,
      msg: {
        marginTop: 12,
        fontSize: 13,
        fontWeight: 800,
        color:
          msg.toLowerCase().includes("success") || msg.toLowerCase().includes("created")
            ? (dark ? "#86efac" : "#166534")
            : (dark ? "#fca5a5" : "#991b1b"),
        minHeight: 18,
        textAlign: "center",
      } as React.CSSProperties,
      toggle: {
        marginTop: 14,
        textAlign: "center",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 900,
        color: dark ? "#93c5fd" : "#0f172a",
        userSelect: "none",
      } as React.CSSProperties,
      bottomRow: {
        marginTop: 12,
        display: "flex",
        justifyContent: "center",
        gap: 6,
        flexWrap: "wrap",
        fontSize: 12,
        fontWeight: 800,
        color: sub,
      } as React.CSSProperties,
      link: {
        cursor: "pointer",
        color: dark ? "#a7f3d0" : "#2563eb",
        textDecoration: "none",
        fontWeight: 900,
      } as React.CSSProperties,
    };
  }, [dark, msg]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setMsg("Please fill all fields.");
      return;
    }
    if (!passwordOk) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Backend expects: { name, email, password }
      const res = await api.post<RegisterResponse>("/api/auth/register", {
        name: cleanName,
        email: cleanEmail,
        password,
      });

      // ✅ Save in AuthProvider + localStorage
      login(res.data.token, res.data.user);

      // ✅ Redirect by role
      navigate(
        res.data.user.role === "admin" ? "/app/admin/dashboard" : "/app/user/dashboard",
        { replace: true }
      );
    } catch (err: any) {
      console.log("REGISTER ERROR:", err);
      console.log("REGISTER ERROR RESPONSE:", err?.response?.data);

      setMsg(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h1 style={S.title}>Create Account</h1>
        <p style={S.sub}>Driving License System • Register</p>

        <form onSubmit={submit}>
          <div style={S.field}>
            <span style={S.icon}>🧑</span>
            <input
              style={S.input}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={S.field}>
            <span style={S.icon}>📧</span>
            <input
              style={S.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={S.field}>
            <span style={S.icon}>🔒</span>
            <input
              style={S.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={S.hint}>
            Password must be at least 6 characters {password ? (passwordOk ? "✅" : "❌") : ""}
          </div>

          <button
            style={{ ...S.btn, ...(loading || !passwordOk ? S.btnDisabled : {}) }}
            type="submit"
            disabled={loading || !passwordOk}
          >
            {loading ? "Creating..." : "Register"}
          </button>

          <div style={S.msg}>{msg}</div>
        </form>

        <div style={S.bottomRow}>
          <span>Already have an account?</span>
          <span style={S.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </div>

        <div style={S.toggle} onClick={() => setDark(!dark)}>
          {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
        </div>
      </div>
    </div>
  );
}
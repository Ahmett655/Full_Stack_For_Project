import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  // use same theme behavior as LoginPage
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call register API
    // after success:
    navigate("/login");
  };

  const S: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      background: dark
        ? "radial-gradient(900px 500px at 20% 10%, rgba(34,197,94,0.22), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(59,130,246,0.18), transparent 60%), linear-gradient(180deg,#020617,#0b1225)"
        : "radial-gradient(900px 500px at 20% 10%, rgba(59,130,246,0.20), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(34,197,94,0.18), transparent 60%), linear-gradient(180deg,#f8fafc,#eef2ff)",
      transition: "0.35s",
    },
    card: {
      width: "100%",
      maxWidth: 420,
      borderRadius: 20,
      padding: 26,
      background: dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.95)",
      border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.10)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      backdropFilter: "blur(14px)",
    },
    title: {
      margin: 0,
      textAlign: "center",
      fontSize: 22,
      fontWeight: 900,
      color: dark ? "#fff" : "#0f172a",
    },
    sub: {
      marginTop: 6,
      textAlign: "center",
      fontSize: 13,
      fontWeight: 700,
      color: dark ? "rgba(226,232,240,0.80)" : "rgba(51,65,85,0.85)",
      marginBottom: 18,
    },
    field: { position: "relative", marginBottom: 12 },
    icon: {
      position: "absolute",
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: 16,
      opacity: 0.75,
      transition: "0.25s",
    },
    input: {
      width: "100%",
      padding: "14px 14px 14px 42px",
      borderRadius: 12,
      border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(15,23,42,0.12)",
      outline: "none",
      fontSize: 14,
      background: dark ? "rgba(2,6,23,0.35)" : "#fff",
      color: dark ? "#fff" : "#0f172a",
    },
    hint: {
      marginTop: -6,
      marginBottom: 10,
      fontSize: 12,
      fontWeight: 800,
      color: dark ? "rgba(226,232,240,0.75)" : "rgba(51,65,85,0.75)",
    },
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
    },
    toggle: {
      marginTop: 14,
      textAlign: "center",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 900,
      color: dark ? "#93c5fd" : "#0f172a",
      userSelect: "none",
    },
    bottomRow: {
      marginTop: 12,
      display: "flex",
      justifyContent: "center",
      gap: 6,
      flexWrap: "wrap",
      fontSize: 12,
      fontWeight: 800,
      color: dark ? "rgba(226,232,240,0.80)" : "rgba(51,65,85,0.85)",
    },
    link: {
      cursor: "pointer",
      color: dark ? "#a7f3d0" : "#2563eb",
      textDecoration: "none",
      fontWeight: 900,
    },
  };

  const passwordOk = password.length >= 6;

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

          <button style={{ ...S.btn, opacity: passwordOk ? 1 : 0.7 }} type="submit" disabled={!passwordOk}>
            Register
          </button>
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
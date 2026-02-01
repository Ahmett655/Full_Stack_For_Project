import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Halkan API login ayaad ku xireysaa marka dambe
    navigate("/app/user/dashboard");
  };

  const S: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: dark
        ? "radial-gradient(circle at top,#16a34a33,#020617)"
        : "radial-gradient(circle at top,#3b82f633,#f8fafc)",
      padding: 16,
      transition: "0.4s",
    },
    card: {
      width: "100%",
      maxWidth: 380,
      padding: 28,
      borderRadius: 20,
      background: dark ? "rgba(255,255,255,0.08)" : "#ffffff",
      backdropFilter: "blur(14px)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    },
    title: {
      textAlign: "center",
      fontSize: 22,
      fontWeight: 900,
      color: dark ? "#fff" : "#0f172a",
    },
    sub: {
      textAlign: "center",
      fontSize: 13,
      marginBottom: 22,
      color: dark ? "#cbd5f5" : "#475569",
    },
    field: {
      position: "relative",
      marginBottom: 14,
    },
    icon: {
      position: "absolute",
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: 16,
      opacity: 0.7,
    },
    input: {
      width: "100%",
      padding: "14px 14px 14px 42px",
      borderRadius: 12,
      border: "none",
      outline: "none",
      fontSize: 14,
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
      marginTop: 10,
    },
    toggle: {
      marginTop: 16,
      textAlign: "center",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 800,
      color: dark ? "#a7f3d0" : "#2563eb",
    },
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h1 style={S.title}>Driving License System</h1>
        <p style={S.sub}>Ministry of Transport</p>

        <form onSubmit={submit}>
          <div style={S.field}>
            <span style={S.icon}>👤</span>
            <input
              style={S.input}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <button style={S.btn}>Login</button>
        </form>

        <div style={S.toggle} onClick={() => setDark(!dark)}>
          {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
        </div>
      </div>
    </div>
  );
}
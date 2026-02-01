import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API login kadib
    navigate("/app/user/dashboard");
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
      maxWidth: 400,
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
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 6,
      marginBottom: 10,
      gap: 10,
      flexWrap: "wrap",
    },
    smallLink: {
      fontSize: 12,
      fontWeight: 800,
      cursor: "pointer",
      color: dark ? "#a7f3d0" : "#2563eb",
      textDecoration: "none",
      userSelect: "none",
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
    btnGhost: {
      width: "100%",
      padding: 12,
      borderRadius: 12,
      border: dark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.12)",
      background: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.65)",
      color: dark ? "#fff" : "#0f172a",
      fontWeight: 900,
      cursor: "pointer",
      marginTop: 10,
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
    divider: {
      marginTop: 14,
      marginBottom: 10,
      height: 1,
      background: dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.10)",
    },
    bottomText: {
      marginTop: 10,
      textAlign: "center",
      fontSize: 12,
      fontWeight: 800,
      color: dark ? "rgba(226,232,240,0.80)" : "rgba(51,65,85,0.85)",
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
              placeholder="Email / Username"
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

          {/* Links row */}
          <div style={S.row}>
            <span style={S.smallLink} onClick={() => alert("Forgot password later…")}>
              Forgot password?
            </span>

            <span style={S.smallLink} onClick={() => navigate("/register")}>
              Create account
            </span>
          </div>

          <button style={S.btn} type="submit">
            Login
          </button>
        </form>

        <div style={S.divider} />

        {/* Register button (optional but nice) */}
        <button style={S.btnGhost} onClick={() => navigate("/register")}>
          Register
        </button>

        <div style={S.toggle} onClick={() => setDark(!dark)}>
          {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
        </div>

        <div style={S.bottomText}>
          By continuing, you agree to system policies.
        </div>
      </div>
    </div>
  );
}
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

type LoginResponse = {
  token: string;
  user: { _id: string; name: string; email: string; role: string };
};

export default function LoginPage() {
  const nav = useNavigate();

  const [dark, setDark] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const S = useMemo(() => {
    const bg = dark
      ? "radial-gradient(900px 500px at 15% 10%, rgba(34,197,94,0.18), transparent 60%), radial-gradient(900px 500px at 85% 30%, rgba(59,130,246,0.16), transparent 60%), linear-gradient(180deg, #0b1220, #0a162a)"
      : "radial-gradient(900px 500px at 15% 10%, rgba(34,197,94,0.16), transparent 60%), radial-gradient(900px 500px at 85% 30%, rgba(59,130,246,0.14), transparent 60%), linear-gradient(180deg, #eef6ff, #e6f2ff)";

    const card = dark
      ? "rgba(15,23,42,0.62)"
      : "rgba(255,255,255,0.72)";

    const border = dark ? "rgba(148,163,184,0.18)" : "rgba(15,23,42,0.12)";
    const text = dark ? "#e5e7eb" : "#0f172a";
    const sub = dark ? "rgba(229,231,235,0.75)" : "rgba(15,23,42,0.65)";
    const field = dark ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.06)";
    const fieldBorder = dark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.12)";

    return {
      page: {
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: bg,
        color: text,
        overflow: "hidden",
      } as React.CSSProperties,

      wrap: {
        width: "min(420px, 100%)",
        position: "relative",
      } as React.CSSProperties,

      glowTop: {
        position: "absolute",
        inset: "-120px -120px auto -120px",
        height: 180,
        background:
          "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.35), transparent 65%)",
        filter: "blur(16px)",
        opacity: dark ? 1 : 0.75,
        pointerEvents: "none",
      } as React.CSSProperties,

      glowRight: {
        position: "absolute",
        inset: "-100px -140px auto auto",
        width: 220,
        height: 220,
        background:
          "radial-gradient(circle at 40% 40%, rgba(59,130,246,0.30), transparent 65%)",
        filter: "blur(18px)",
        opacity: dark ? 1 : 0.7,
        pointerEvents: "none",
      } as React.CSSProperties,

      card: {
        position: "relative",
        borderRadius: 18,
        border: `1px solid ${border}`,
        background: card,
        backdropFilter: "blur(14px)",
        boxShadow: dark
          ? "0 18px 60px rgba(0,0,0,0.45)"
          : "0 18px 60px rgba(2,6,23,0.18)",
        overflow: "hidden",
      } as React.CSSProperties,

      header: {
        padding: "22px 22px 10px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
      } as React.CSSProperties,

      titleWrap: { paddingRight: 6 } as React.CSSProperties,

      title: {
        margin: 0,
        fontSize: 22,
        letterSpacing: 0.2,
        fontWeight: 800,
        textShadow: dark ? "0 2px 0 rgba(0,0,0,0.35)" : "none",
      } as React.CSSProperties,

      sub: {
        margin: "6px 0 0",
        fontSize: 12.5,
        color: sub,
        fontWeight: 600,
      } as React.CSSProperties,

      toggle: {
        border: `1px solid ${border}`,
        background: field,
        color: text,
        padding: "10px 12px",
        borderRadius: 12,
        cursor: "pointer",
        fontWeight: 800,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        userSelect: "none",
      } as React.CSSProperties,

      body: { padding: "10px 22px 18px" } as React.CSSProperties,

      field: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 12px",
        borderRadius: 14,
        border: `1px solid ${fieldBorder}`,
        background: field,
        marginTop: 12,
      } as React.CSSProperties,

      iconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        display: "grid",
        placeItems: "center",
        border: `1px solid ${border}`,
        background: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)",
        animation: "floaty 3.8s ease-in-out infinite",
      } as React.CSSProperties,

      input: {
        width: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
        color: text,
        fontSize: 14.5,
        fontWeight: 650,
      } as React.CSSProperties,

      rowLinks: {
        marginTop: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        flexWrap: "wrap",
      } as React.CSSProperties,

      link: {
        color: dark ? "rgba(167,243,208,0.92)" : "rgba(2,132,199,0.95)",
        textDecoration: "none",
        fontWeight: 800,
        fontSize: 13,
      } as React.CSSProperties,

      btn: {
        marginTop: 16,
        width: "100%",
        padding: "13px 14px",
        borderRadius: 14,
        border: "none",
        cursor: "pointer",
        fontWeight: 900,
        fontSize: 15,
        color: "#06200f",
        background:
          "linear-gradient(90deg, rgba(34,197,94,1), rgba(16,185,129,1))",
        boxShadow: "0 10px 26px rgba(34,197,94,0.25)",
        transform: "translateY(0)",
        transition: "transform 0.15s ease, filter 0.15s ease",
      } as React.CSSProperties,

      btnDisabled: {
        filter: "grayscale(0.35) brightness(0.85)",
        cursor: "not-allowed",
      } as React.CSSProperties,

      secondaryBtn: {
        marginTop: 12,
        width: "100%",
        padding: "12px 14px",
        borderRadius: 14,
        border: `1px solid ${border}`,
        cursor: "pointer",
        fontWeight: 900,
        fontSize: 14,
        color: text,
        background: "transparent",
      } as React.CSSProperties,

      msg: {
        marginTop: 12,
        fontSize: 13,
        fontWeight: 750,
        color:
          msg.includes("success") || msg.includes("Welcome")
            ? (dark ? "#86efac" : "#166534")
            : (dark ? "#fca5a5" : "#991b1b"),
        minHeight: 18,
      } as React.CSSProperties,

      footer: {
        padding: "0 22px 20px",
        color: sub,
        fontSize: 12,
        fontWeight: 650,
        textAlign: "center",
      } as React.CSSProperties,

      divider: {
        height: 1,
        background: border,
        marginTop: 16,
      } as React.CSSProperties,

      keyframes: `
        @keyframes floaty {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-120%); opacity: .0; }
          40% { opacity: .35; }
          100% { transform: translateX(120%); opacity: 0; }
        }
      `,
    };
  }, [dark, msg]);

  const emailIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke={dark ? "rgba(226,232,240,0.95)" : "rgba(15,23,42,0.85)"}
        strokeWidth="1.6"
      />
      <path
        d="M6.3 7.9 12 12l5.7-4.1"
        stroke={dark ? "rgba(167,243,208,0.95)" : "rgba(2,132,199,0.9)"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const lockIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 10V8.2A5 5 0 0 1 12 3a5 5 0 0 1 5 5.2V10"
        stroke={dark ? "rgba(226,232,240,0.95)" : "rgba(15,23,42,0.85)"}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7.2 10h9.6A2.2 2.2 0 0 1 19 12.2v6.6A2.2 2.2 0 0 1 16.8 21H7.2A2.2 2.2 0 0 1 5 18.8v-6.6A2.2 2.2 0 0 1 7.2 10Z"
        stroke={dark ? "rgba(167,243,208,0.95)" : "rgba(2,132,199,0.9)"}
        strokeWidth="1.6"
      />
      <path
        d="M12 14.2v2.6"
        stroke={dark ? "rgba(226,232,240,0.95)" : "rgba(15,23,42,0.85)"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!email.trim() || !password.trim()) {
      setMsg("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<LoginResponse>("/api/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // redirect by role
      if (res.data.user.role === "admin") nav("/app/admin/dashboard");
      else nav("/app/user/dashboard");
    } catch (err: any) {
      const m =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setMsg(m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.page}>
      <style>{S.keyframes}</style>

      <div style={S.wrap}>
        <div style={S.glowTop} />
        <div style={S.glowRight} />

        <div style={S.card}>
          <div style={S.header}>
            <div style={S.titleWrap}>
              <h1 style={S.title}>Driving License System</h1>
              <p style={S.sub}>Ministry of Transport</p>
            </div>

            <button style={S.toggle} onClick={() => setDark((v) => !v)}>
              <span style={{ display: "inline-flex" }}>{dark ? "🌙" : "☀️"}</span>
              {dark ? "Dark" : "Light"}
            </button>
          </div>

          <div style={S.body}>
            <form onSubmit={onSubmit}>
              <div style={S.field}>
                <div style={S.iconBox}>{emailIcon}</div>
                <input
                  style={S.input}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div style={S.field}>
                <div style={S.iconBox}>{lockIcon}</div>
                <input
                  style={S.input}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              {/* ✅ Forgot + Register links (MEESHAAN AYUU KU YAAL) */}
              <div style={S.rowLinks}>
                <Link to="/forgot-password" style={S.link}>
                  Forgot password?
                </Link>

                <Link to="/register" style={S.link}>
                  Create account
                </Link>
              </div>

              <button
                type="submit"
                style={{
                  ...S.btn,
                  ...(loading ? S.btnDisabled : {}),
                }}
                disabled={loading}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(1px)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0px)";
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <Link to="/register" style={{ textDecoration: "none" }}>
                <button type="button" style={S.secondaryBtn}>
                  Register
                </button>
              </Link>

              <div style={S.msg}>{msg}</div>
            </form>

            <div style={S.divider} />
          </div>

          <div style={S.footer}>
            By continuing, you agree to system policies.
          </div>
        </div>
      </div>
    </div>
  );
}
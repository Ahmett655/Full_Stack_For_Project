// frontend/src/auth/ResetPasswordPage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const emailParam = sp.get("email") || "";
  const tokenParam = sp.get("token") || "";

  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState("");

  const [dark, setDark] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const S = useMemo< Record<string, React.CSSProperties> >(() => {
    const bg = dark
      ? "radial-gradient(900px 500px at 15% 10%, rgba(34,197,94,0.18), transparent 60%), radial-gradient(900px 500px at 85% 25%, rgba(59,130,246,0.20), transparent 55%), linear-gradient(180deg, #020617 0%, #0b1222 100%)"
      : "radial-gradient(900px 500px at 15% 10%, rgba(34,197,94,0.20), transparent 60%), radial-gradient(900px 500px at 85% 25%, rgba(59,130,246,0.22), transparent 55%), linear-gradient(180deg, #f6fbff 0%, #eef6ff 100%)";

    const cardBg = dark ? "rgba(15,23,42,0.62)" : "rgba(255,255,255,0.72)";
    const text = dark ? "#E5E7EB" : "#0f172a";
    const sub = dark ? "rgba(229,231,235,0.75)" : "rgba(15,23,42,0.65)";
    const border = dark ? "rgba(148,163,184,0.18)" : "rgba(15,23,42,0.12)";

    return {
      page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "22px 14px",
        background: bg,
      },
      wrap: { width: "100%", maxWidth: 560 },
      card: {
        width: "100%",
        borderRadius: 22,
        border: `1px solid ${border}`,
        background: cardBg,
        boxShadow: dark
          ? "0 30px 90px rgba(0,0,0,0.55)"
          : "0 30px 90px rgba(2,6,23,0.18)",
        backdropFilter: "blur(10px)",
        overflow: "hidden",
        position: "relative",
      },
      topGlow: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: dark
          ? "radial-gradient(600px 200px at 20% 0%, rgba(34,197,94,0.18), transparent 60%), radial-gradient(600px 200px at 85% 10%, rgba(59,130,246,0.20), transparent 62%)"
          : "radial-gradient(600px 200px at 20% 0%, rgba(34,197,94,0.20), transparent 60%), radial-gradient(600px 200px at 85% 10%, rgba(59,130,246,0.22), transparent 62%)",
      },
      body: { position: "relative", padding: 22 },
      headerRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 12,
      },
      title: { margin: 0, fontSize: 22, fontWeight: 900, color: text },
      sub: { margin: "6px 0 0", fontSize: 13, fontWeight: 800, color: sub },
      toggle: {
        border: `1px solid ${border}`,
        background: dark ? "rgba(2,6,23,0.35)" : "rgba(255,255,255,0.7)",
        padding: "10px 12px",
        borderRadius: 999,
        cursor: "pointer",
        color: text,
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        gap: 8,
      },

      grid: { display: "grid", gap: 12 },
      label: { display: "block", fontSize: 12, fontWeight: 900, color: sub, marginBottom: 8 },
      inputWrap: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 12px",
        borderRadius: 14,
        border: `1px solid ${border}`,
        background: dark ? "rgba(2,6,23,0.35)" : "rgba(255,255,255,0.85)",
      },
      input: {
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: 14,
        fontWeight: 900,
        background: "transparent",
        color: text,
      },

      btnRow: { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" },
      btn: {
        border: `1px solid ${border}`,
        background: dark ? "rgba(2,6,23,0.35)" : "rgba(255,255,255,0.85)",
        padding: "12px 14px",
        borderRadius: 14,
        cursor: "pointer",
        fontWeight: 900,
        color: text,
        flex: "1 1 180px",
      },
      btnPrimary: {
        background: "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(16,185,129,0.95))",
        border: "1px solid rgba(34,197,94,0.35)",
        color: "#fff",
      },

      alertOk: {
        marginTop: 12,
        borderRadius: 14,
        padding: 12,
        border: "1px solid rgba(34,197,94,0.30)",
        background: "rgba(34,197,94,0.12)",
        color: dark ? "#DCFCE7" : "#14532d",
        fontWeight: 900,
        fontSize: 13,
      },
      alertErr: {
        marginTop: 12,
        borderRadius: 14,
        padding: 12,
        border: "1px solid rgba(239,68,68,0.30)",
        background: "rgba(239,68,68,0.12)",
        color: dark ? "#FEE2E2" : "#7f1d1d",
        fontWeight: 900,
        fontSize: 13,
      },
      hint: { marginTop: 10, fontSize: 12, fontWeight: 800, color: sub, lineHeight: 1.4 },
    };
  }, [dark]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setSaving(true);
    try {
      const res = await api.post("/api/auth/reset-password", {
        email,
        token,
        newPassword,
      });

      // auto-login after reset (token returned)
      if (res?.data?.token) localStorage.setItem("token", res.data.token);

      setMsg("Password reset successful. You can login now.");
      setTimeout(() => nav("/login"), 800);
    } catch (ex: any) {
      setErr(ex?.response?.data?.message || "Reset failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.card}>
          <div style={S.topGlow} />
          <div style={S.body}>
            <div style={S.headerRow}>
              <div>
                <h1 style={S.title}>Reset Password</h1>
                <p style={S.sub}>Driving License System • Ministry of Transport</p>
              </div>

              <button style={S.toggle} onClick={() => setDark((v) => !v)} type="button">
                <span>{dark ? "🌙" : "☀️"}</span>
                {dark ? "Dark" : "Light"}
              </button>
            </div>

            <form onSubmit={submit}>
              <div style={S.grid}>
                <div>
                  <label style={S.label}>Email</label>
                  <div style={S.inputWrap}>
                    <input style={S.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                  </div>
                </div>

                <div>
                  <label style={S.label}>Token</label>
                  <div style={S.inputWrap}>
                    <input style={S.input} value={token} onChange={(e) => setToken(e.target.value)} placeholder="paste token here" required />
                  </div>
                </div>

                <div>
                  <label style={S.label}>New Password</label>
                  <div style={S.inputWrap}>
                    <input
                      style={S.input}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      placeholder="min 6 chars"
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={S.btnRow}>
                <button style={{ ...S.btn, ...S.btnPrimary, opacity: saving ? 0.75 : 1 }} disabled={saving}>
                  {saving ? "Saving..." : "Reset Password"}
                </button>
                <button style={S.btn} type="button" onClick={() => nav("/login")}>
                  Back to Login
                </button>
              </div>

              <div style={S.hint}>
                Haddii aad DEV mode ku jirto: link-ga reset-ka wuxuu ka muuqanayaa backend console (Render logs).
              </div>

              {msg && <div style={S.alertOk}>{msg}</div>}
              {err && <div style={S.alertErr}>{err}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
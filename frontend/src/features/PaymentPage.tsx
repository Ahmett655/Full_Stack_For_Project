// frontend/src/pages/PaymentFormPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

type PaymentService = "EVC-PLUS" | "SAHAL" | "EDAHAB";

type PayRes = {
  message?: string;
  request?: any;
};

export default function PaymentFormPage() {
  const nav = useNavigate();
  const params = useParams<{ id: string }>();
  const requestId = params.id || "";

  const [number, setNumber] = useState("");
  const [service, setService] = useState<PaymentService>("EVC-PLUS");
  const [amount, setAmount] = useState<string>("150");
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // optional sound (browser must allow audio after user gesture)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fee = 150;

  const paidAmountNum = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const tooLow = useMemo(() => {
    if (!Number.isFinite(paidAmountNum)) return false;
    return paidAmountNum < fee;
  }, [paidAmountNum]);

  const submitDisabled = useMemo(() => {
    if (!requestId) return true;
    if (!number.trim()) return true;
    if (!service) return true;
    if (!Number.isFinite(paidAmountNum)) return true;
    if (paidAmountNum < fee) return true;
    return loading;
  }, [requestId, number, service, paidAmountNum, loading]);

  useEffect(() => {
    // preload audio if you have a valid file in /public/sounds/cash.mp3
    // If you don't have it, this won't break anything.
    try {
      audioRef.current = new Audio("/sounds/cash.mp3");
      audioRef.current.volume = 0.8;
    } catch {
      audioRef.current = null;
    }
  }, []);

  const playCashSound = async () => {
    try {
      if (!audioRef.current) return;
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch {
      // Some browsers block audio—ignore silently
    }
  };

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!requestId) {
      setErr("Request ID is missing. Please go back and open payment again.");
      return;
    }

    const cleanNumber = number.trim();
    const amt = Number(amount);

    if (!cleanNumber) {
      setErr("Please enter your mobile number.");
      return;
    }
    if (!Number.isFinite(amt)) {
      setErr("Amount must be a valid number.");
      return;
    }
    if (amt < fee) {
      setErr(`Insufficient amount. Fee is $${fee}.`);
      return;
    }

    setLoading(true);
    try {
      // ✅ Backend route example:
      // POST /api/payments/:requestId  body: { number, service, amount }
      const res = await api.post<PayRes>(`/api/payments/${requestId}`, {
        number: cleanNumber,
        provider:service,
        amount: amt,
      });

      // success UI
      await playCashSound();
      setSuccess(true);

      // you can auto-navigate after 1.3s
      setTimeout(() => {
        nav("/app/user/requests");
      }, 1300);

      return res.data;
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Inline styles (Figma-like)
  // =========================
  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      padding: "28px 14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "radial-gradient(1200px 600px at 10% 10%, rgba(59,130,246,0.18), transparent 55%), radial-gradient(900px 500px at 90% 20%, rgba(34,197,94,0.14), transparent 60%), linear-gradient(180deg, rgba(2,6,23,0.04), rgba(2,6,23,0.00))",
    },
    shell: {
      width: "100%",
      maxWidth: 470,
    },
    topRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
      gap: 10,
    },
    backBtn: {
      border: "1px solid rgba(15,23,42,0.10)",
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(8px)",
      padding: "10px 12px",
      borderRadius: 12,
      cursor: "pointer",
      fontWeight: 600,
    },
    badge: {
      padding: "8px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      background: "rgba(30,58,138,0.10)",
      color: "#1E3A8A",
      border: "1px solid rgba(30,58,138,0.18)",
      whiteSpace: "nowrap",
    },
    card: {
      borderRadius: 18,
      border: "1px solid rgba(15,23,42,0.10)",
      background: "rgba(255,255,255,0.78)",
      backdropFilter: "blur(10px)",
      boxShadow:
        "0 20px 60px rgba(2,6,23,0.12), 0 2px 8px rgba(2,6,23,0.06)",
      overflow: "hidden",
    },
    header: {
      padding: "18px 18px 12px 18px",
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      background: "linear-gradient(135deg, rgba(30,58,138,0.18), rgba(34,197,94,0.14))",
      border: "1px solid rgba(15,23,42,0.10)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "0 0 auto",
    },
    title: {
      margin: 0,
      fontSize: 18,
      fontWeight: 800,
      color: "#0F172A",
      lineHeight: 1.2,
    },
    sub: {
      margin: "6px 0 0 0",
      fontSize: 13,
      color: "rgba(15,23,42,0.65)",
      lineHeight: 1.35,
    },
    step: {
      marginTop: 10,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12,
      fontWeight: 700,
      color: "rgba(15,23,42,0.65)",
    },
    stepPill: {
      padding: "6px 10px",
      borderRadius: 999,
      background: "rgba(245,158,11,0.12)",
      border: "1px solid rgba(245,158,11,0.18)",
      color: "#92400E",
      fontWeight: 800,
      fontSize: 12,
    },
    divider: {
      height: 1,
      background: "rgba(15,23,42,0.08)",
    },
    body: {
      padding: 18,
    },
    summary: {
      borderRadius: 14,
      border: "1px solid rgba(15,23,42,0.10)",
      background: "rgba(255,255,255,0.6)",
      padding: 14,
      marginBottom: 14,
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 8,
      fontSize: 13,
      color: "rgba(15,23,42,0.78)",
    },
    feeStrong: {
      fontWeight: 900,
      color: "#1E3A8A",
    },
    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 800,
      color: "rgba(15,23,42,0.72)",
      marginBottom: 6,
    },
    input: {
      width: "100%",
      padding: "12px 12px",
      borderRadius: 12,
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0.95)",
      outline: "none",
      fontSize: 14,
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
    },
    help: {
      marginTop: 6,
      fontSize: 12,
      color: "rgba(15,23,42,0.55)",
      lineHeight: 1.35,
    },
    alertError: {
      borderRadius: 14,
      padding: 12,
      marginBottom: 12,
      border: "1px solid rgba(239,68,68,0.22)",
      background: "rgba(239,68,68,0.08)",
      color: "#991B1B",
      fontWeight: 700,
      fontSize: 13,
    },
    alertWarn: {
      borderRadius: 14,
      padding: 10,
      marginTop: 10,
      border: "1px solid rgba(245,158,11,0.20)",
      background: "rgba(245,158,11,0.10)",
      color: "#92400E",
      fontWeight: 700,
      fontSize: 13,
    },
    secureRow: {
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: 12,
      borderRadius: 14,
      border: "1px solid rgba(15,23,42,0.10)",
      background: "rgba(255,255,255,0.55)",
      color: "rgba(15,23,42,0.70)",
      fontSize: 13,
      fontWeight: 700,
    },
    btnRow: {
      marginTop: 14,
      display: "flex",
      gap: 10,
    },
    btnPrimary: {
      flex: 1,
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid rgba(34,197,94,0.30)",
      background: "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(16,185,129,0.95))",
      color: "white",
      fontWeight: 900,
      cursor: "pointer",
    },
    btnGhost: {
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0.7)",
      color: "#0F172A",
      fontWeight: 900,
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    btnDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    // success overlay
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(2,6,23,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      zIndex: 50,
    },
    successCard: {
      width: "100%",
      maxWidth: 420,
      borderRadius: 18,
      background: "rgba(255,255,255,0.92)",
      border: "1px solid rgba(15,23,42,0.12)",
      boxShadow: "0 20px 60px rgba(2,6,23,0.22)",
      padding: 18,
      textAlign: "center",
    },
    checkWrap: {
      width: 64,
      height: 64,
      margin: "4px auto 10px auto",
      borderRadius: 18,
      background: "rgba(34,197,94,0.12)",
      border: "1px solid rgba(34,197,94,0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "pop 320ms ease-out",
    },
    successTitle: {
      margin: 0,
      fontSize: 18,
      fontWeight: 900,
      color: "#065F46",
    },
    successText: {
      margin: "6px 0 0 0",
      fontSize: 13,
      color: "rgba(15,23,42,0.70)",
      lineHeight: 1.4,
    },
    smallMuted: {
      marginTop: 10,
      fontSize: 12,
      color: "rgba(15,23,42,0.55)",
      fontWeight: 700,
    },
  };

  return (
    <div style={styles.page}>
      {/* keyframes inline (still inside component, no external CSS) */}
      <style>
        {`
          @keyframes pop { 
            0% { transform: scale(.85); opacity: .5; } 
            100% { transform: scale(1); opacity: 1; } 
          }
          @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
        `}
      </style>

      <div style={styles.shell}>
        <div style={styles.topRow}>
          <button style={styles.backBtn} onClick={() => nav(-1)}>
            ← Back
          </button>
          <span style={styles.badge}>Fee: ${fee} (Fixed)</span>
        </div>

        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.iconWrap} aria-hidden="true">
              {/* wallet icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 7.5C3 6.12 4.12 5 5.5 5H18.5C19.88 5 21 6.12 21 7.5V9H6.2C4.43 9 3 10.43 3 12.2V7.5Z"
                  stroke="rgba(15,23,42,0.75)"
                  strokeWidth="1.6"
                />
                <path
                  d="M3 12.2C3 10.43 4.43 9 6.2 9H21V16.5C21 17.88 19.88 19 18.5 19H5.5C4.12 19 3 17.88 3 16.5V12.2Z"
                  stroke="rgba(15,23,42,0.75)"
                  strokeWidth="1.6"
                />
                <path
                  d="M16 13.5H19"
                  stroke="rgba(34,197,94,0.95)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={styles.title}>License Payment</h2>
              <p style={styles.sub}>
                Complete your payment to continue. Fee is fixed at <b>${fee}</b>.
              </p>
              <div style={styles.step}>
                <span style={styles.stepPill}>Step 2 of 3</span>
                <span>Payment</span>
              </div>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.body}>
            {err && <div style={styles.alertError}>{err}</div>}

            <div style={styles.summary}>
              <div style={styles.summaryRow}>
                <span>Request ID</span>
                <span style={{ fontWeight: 900, color: "rgba(15,23,42,0.85)" }}>
                  {requestId ? requestId.slice(-8).toUpperCase() : "—"}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span>License Fee</span>
                <span style={styles.feeStrong}>${fee}</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(15,23,42,0.55)", fontWeight: 700 }}>
                Note: If you enter more than ${fee}, only ${fee} is counted as fee.
              </div>
            </div>

            <form onSubmit={onPay}>
              <div style={{ marginBottom: 12 }}>
                <label style={styles.label}>Mobile Number</label>
                <input
                  style={styles.input}
                  placeholder="e.g. 61xxxxxxx"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                />
                <div style={styles.help}>Enter the number used for the payment.</div>
              </div>

              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>Service</label>
                  <select
                    style={styles.input}
                    value={service}
                    onChange={(e) => setService(e.target.value as PaymentService)}
                  >
                    <option value="EVC-PLUS">EVC-PLUS</option>
                    <option value="SAHAL">SAHAL</option>
                    <option value="EDAHAB">EDAHAB</option>
                  </select>
                  <div style={styles.help}>Choose your mobile money service.</div>
                </div>

                <div>
                  <label style={styles.label}>Amount ($)</label>
                  <input
                    style={styles.input}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="decimal"
                    placeholder="150"
                  />
                  <div style={styles.help}>Minimum is ${fee}.</div>
                </div>
              </div>

              {Number.isFinite(paidAmountNum) && paidAmountNum > fee && (
                <div style={styles.alertWarn}>
                  You entered <b>${paidAmountNum}</b>. The fee is <b>${fee}</b> only.
                </div>
              )}

              {tooLow && (
                <div style={styles.alertWarn}>
                  Insufficient amount. Fee is <b>${fee}</b>.
                </div>
              )}

              <div style={styles.secureRow}>
                <span aria-hidden="true">
                  {/* lock icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 11V8.5C7 5.46 9.46 3 12.5 3C15.54 3 18 5.46 18 8.5V11"
                      stroke="rgba(15,23,42,0.7)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.5 11H18.5C19.6 11 20.5 11.9 20.5 13V19C20.5 20.1 19.6 21 18.5 21H6.5C5.4 21 4.5 20.1 4.5 19V13C4.5 11.9 5.4 11 6.5 11Z"
                      stroke="rgba(15,23,42,0.7)"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
                <span>Secure Payment • Your data is protected</span>
              </div>

              <div style={styles.btnRow}>
                <button
                  type="submit"
                  style={{
                    ...styles.btnPrimary,
                    ...(submitDisabled ? styles.btnDisabled : {}),
                  }}
                  disabled={submitDisabled}
                >
                  {loading ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          border: "2px solid rgba(255,255,255,0.65)",
                          borderTopColor: "rgba(255,255,255,1)",
                          display: "inline-block",
                          animation: "spin 700ms linear infinite",
                        }}
                      />
                      Processing...
                    </span>
                  ) : (
                    "Pay Now"
                  )}
                </button>

                <button type="button" style={styles.btnGhost} onClick={() => nav("/app/user/requests")}>
                  My Requests
                </button>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, color: "rgba(15,23,42,0.55)", fontWeight: 700 }}>
                Tip: After payment, wait for admin approval to download your PDF card.
              </div>
            </form>
          </div>
        </div>
      </div>

      {success && (
        <div style={styles.overlay}>
          <div style={styles.successCard}>
            <div style={styles.checkWrap}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 7L10.5 16.5L4 10"
                  stroke="rgba(34,197,94,0.95)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 style={styles.successTitle}>Payment Submitted</h3>
            <p style={styles.successText}>
              Your payment has been recorded successfully. Redirecting to your requests…
            </p>
            <div style={styles.smallMuted}>✅ Thank you</div>
          </div>
        </div>
      )}
    </div>
  );
}
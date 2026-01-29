// frontend/src/features/PaymentPage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

type PayRes = {
  message?: string;
  request?: any;
};

export default function PaymentPage() {
  const nav = useNavigate();
  const { id } = useParams(); // /app/user/pay/:id

  const [number, setNumber] = useState("");
  const [service, setService] = useState<"EVC-PLUS" | "SAHAL" | "EDAHAB">("EVC-PLUS");
  const [amount, setAmount] = useState("150");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const fee = 150;

  const normalizedAmount = useMemo(() => {
    const n = Number(amount || 0);
    if (Number.isNaN(n) || n <= 0) return fee;
    // user may enter more, backend will charge fee only
    return n;
  }, [amount]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!id) return setErr("Missing request id");

    setLoading(true);
    try {
      // ✅ IMPORTANT:
      // Your backend route is: app.use("/api/payments", requireAuth, paymentRoutes);
      // So usually the endpoint should be:
      // POST /api/payments/:id
      await api.post(`/api/payments/${id}`, {
        number,
        provider: service, 
        amount: normalizedAmount,
      });
      

      // after success go back to my requests
      nav("/app/user/requests");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "26px 24px", // ✅ space from walls
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <h2 style={{ margin: "6px 0 14px 0" }}>Payment</h2>

      <button
        type="button"
        className="btn"
        style={{ padding: "8px 14px", marginBottom: 12 }}
        onClick={() => nav(-1)}
      >
        Back
      </button>

      <div
        className="card"
        style={{
          padding: "22px 22px", // ✅ inside card spacing
          borderRadius: 14,
        }}
      >
        {err && (
          <div
            style={{
              marginBottom: 14,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,90,90,.35)",
              background: "rgba(255,90,90,.08)",
            }}
          >
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 13, opacity: 0.9 }}>Number</label>
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="e.g. 61xxxxxxx"
                className="input"
                style={{
                  padding: "12px 12px",
                  width: "100%",
                  maxWidth: 520, // ✅ prevent tiny fields
                }}
                required
              />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 13, opacity: 0.9 }}>Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as any)}
                className="input"
                style={{
                  padding: "12px 12px",
                  width: "100%",
                  maxWidth: 520,
                }}
              >
                <option value="EVC-PLUS">EVC-PLUS</option>
                <option value="SAHAL">SAHAL</option>
                <option value="EDAHAB">EDAHAB</option>
              </select>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 13, opacity: 0.9 }}>Amount</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min={fee}
                className="input"
                style={{
                  padding: "12px 12px",
                  width: "100%",
                  maxWidth: 220,
                }}
              />
              <small style={{ opacity: 0.8, lineHeight: 1.3 }}>
                Fee is ${fee}. If you enter more, only ${fee} will be charged.
              </small>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "12px 14px",
                border: "none",
                borderRadius: 12,
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
              }}
              className="btn"
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

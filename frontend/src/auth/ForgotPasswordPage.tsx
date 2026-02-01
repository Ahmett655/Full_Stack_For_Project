import { useState, useMemo } from "react";
import { api } from "../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const page = useMemo(() => ({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top, #0f172a, #020617)",
    color: "#fff",
  }), []);

  const card = {
    width: 380,
    padding: 30,
    borderRadius: 16,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMsg(res.data.message);
    } catch {
      setMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <form style={card} onSubmit={submit}>
        <h2>Forgot Password</h2>
        <p>Driving License System</p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          style={{
            width: "100%",
            padding: 12,
            marginTop: 12,
            borderRadius: 10,
            border: "none",
          }}
        />

        <button
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            background: "#22c55e",
            border: "none",
            fontWeight: "bold",
          }}
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
      </form>
    </div>
  );
}
// frontend/src/pages/LicenseCardPreviewPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

type Req = {
  _id: string;
  fullName: string;
  yearOfBirth: number;
  placeOfBirth: string;
  vehicleName: string;
  vehicleType?: string;
  image?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  paymentStatus: "UNPAID" | "PAID";
  createdAt?: string;
  updatedAt?: string;
};

function formatDate(d?: string) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "—";
  }
}

export default function LicenseCardPreviewPage() {
  const nav = useNavigate();
  const params = useParams<{ id: string }>();
  const id = params.id || "";

  const [data, setData] = useState<Req | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ Change to your backend base URL if needed:
  // If api.ts already has baseURL, you can keep this.
  const imageUrl = useMemo(() => {
    if (!data?.image) return "";
    // if stored like "/uploads/xxx.jpg"
    const p = data.image;
    // api might point to backend already; if not, add VITE_API_URL
    const base = (import.meta as any).env?.VITE_API_URL || "";
    return base ? `${base}${p}` : p;
  }, [data?.image]);

  const licenseNo = useMemo(() => {
    if (!data?._id) return "—";
    return data._id.slice(-8).toUpperCase();
  }, [data?._id]);

  const badge = useMemo(() => {
    if (!data) return { text: "—", bg: "#e2e8f0", color: "#0f172a" };

    if (data.status === "APPROVED" && data.paymentStatus === "PAID") {
      return { text: "VALID", bg: "rgba(34,197,94,0.16)", color: "#166534" };
    }
    if (data.status === "REJECTED") {
      return { text: "REJECTED", bg: "rgba(239,68,68,0.14)", color: "#991b1b" };
    }
    return { text: "PENDING", bg: "rgba(245,158,11,0.16)", color: "#92400e" };
  }, [data]);

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        // ✅ Endpoint: GET /api/requests/:id
        const res = await api.get<Req>(`/api/requests/${id}`);
        setData(res.data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load license data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onDownloadPdf = async () => {
    if (!id) return;

    try {
      // ✅ Must be APPROVED + PAID
      // ✅ Endpoint: GET /api/requests/:id/pdf  (returns application/pdf)
      const res = await api.get(`/api/requests/${id}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `license-card-${licenseNo}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.response?.data?.message || "PDF download failed.");
    }
  };

  // =========================
  // Inline Styles (Figma-like)
  // =========================
  const S: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      padding: "22px 14px",
      background:
        "radial-gradient(1100px 500px at 15% 10%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(900px 500px at 90% 25%, rgba(34,197,94,0.14), transparent 60%), linear-gradient(180deg, rgba(2,6,23,0.04), rgba(2,6,23,0))",
      display: "flex",
      justifyContent: "center",
    },
    wrap: { width: "100%", maxWidth: 980 },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
    },
    btn: {
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(8px)",
      padding: "10px 12px",
      borderRadius: 12,
      cursor: "pointer",
      fontWeight: 800,
      color: "#0f172a",
    },
    btnPrimary: {
      border: "1px solid rgba(34,197,94,0.30)",
      background: "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(16,185,129,0.95))",
      color: "#fff",
    },
    btnDisabled: { opacity: 0.55, cursor: "not-allowed" },
    panel: {
      display: "grid",
      gridTemplateColumns: "1.05fr 0.95fr",
      gap: 16,
    },
    panel1col: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 16,
    },
    box: {
      borderRadius: 18,
      border: "1px solid rgba(15,23,42,0.10)",
      background: "rgba(255,255,255,0.78)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 20px 60px rgba(2,6,23,0.12), 0 2px 8px rgba(2,6,23,0.06)",
      overflow: "hidden",
    },
    boxHead: {
      padding: "14px 16px",
      borderBottom: "1px solid rgba(15,23,42,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    h3: { margin: 0, fontSize: 14, fontWeight: 900, color: "#0f172a" },
    small: { fontSize: 12, color: "rgba(15,23,42,0.60)", fontWeight: 800 },

    // ===== Card UI =====
    cardStage: { padding: 16, display: "flex", justifyContent: "center" },
    card: {
      width: 620,
      maxWidth: "100%",
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid rgba(15,23,42,0.12)",
      boxShadow: "0 18px 55px rgba(2,6,23,0.16)",
      background:
        "linear-gradient(180deg, #EAF6FF 0%, #CFE9F6 55%, #EAF6FF 100%)",
      position: "relative",
    },
    cardPattern: {
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(500px 200px at 20% 20%, rgba(30,58,138,0.10), transparent 60%), radial-gradient(600px 260px at 90% 30%, rgba(34,197,94,0.10), transparent 60%)",
      pointerEvents: "none",
    },
    cardPad: { position: "relative", padding: 16 },

    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      alignItems: "flex-start",
      marginBottom: 10,
    },
    govBlock: { display: "flex", gap: 10, alignItems: "center" },
    emblem: {
      width: 44,
      height: 44,
      borderRadius: 14,
      background:
        "linear-gradient(135deg, rgba(30,58,138,0.16), rgba(34,197,94,0.10))",
      border: "1px solid rgba(15,23,42,0.10)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "0 0 auto",
    },
    govText: { lineHeight: 1.1 },
    govTop: {
      fontSize: 12,
      fontWeight: 900,
      color: "#0f172a",
      letterSpacing: 0.4,
    },
    govSub: { marginTop: 4, fontSize: 11, fontWeight: 800, color: "rgba(15,23,42,0.65)" },

    badge: {
      padding: "8px 12px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 900,
      border: "1px solid rgba(15,23,42,0.10)",
      alignSelf: "flex-start",
      whiteSpace: "nowrap",
    },

    titleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 10,
      marginBottom: 12,
    },
    title: {
      margin: 0,
      fontSize: 20,
      fontWeight: 1000 as any,
      letterSpacing: 0.7,
      color: "#1E3A8A",
      textTransform: "uppercase",
    },
    licenseNo: {
      fontSize: 12,
      fontWeight: 1000 as any,
      color: "#0f172a",
      background: "rgba(255,255,255,0.7)",
      border: "1px solid rgba(15,23,42,0.10)",
      padding: "8px 10px",
      borderRadius: 12,
    },

    main: { display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 14 },
    photo: {
      borderRadius: 16,
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0.75)",
      overflow: "hidden",
      height: 160,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    photoImg: { width: "100%", height: "100%", objectFit: "cover" },
    photoEmpty: { fontSize: 12, fontWeight: 900, color: "rgba(15,23,42,0.55)" },

    details: {
      borderRadius: 16,
      border: "1px solid rgba(15,23,42,0.10)",
      background: "rgba(255,255,255,0.65)",
      padding: 12,
    },
    row: {
      display: "grid",
      gridTemplateColumns: "120px 1fr",
      gap: 10,
      padding: "7px 0",
      borderBottom: "1px dashed rgba(15,23,42,0.12)",
    },
    rowLast: { borderBottom: "none" },
    k: { fontSize: 12, fontWeight: 900, color: "rgba(15,23,42,0.65)" },
    v: { fontSize: 13, fontWeight: 900, color: "#0f172a" },

    bottomRow: {
      marginTop: 12,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: 12,
    },
    qr: {
      width: 86,
      height: 86,
      borderRadius: 14,
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 1000 as any,
      color: "rgba(15,23,42,0.55)",
      fontSize: 11,
      textAlign: "center",
      padding: 10,
    },
    footer: {
      fontSize: 11,
      fontWeight: 900,
      color: "rgba(15,23,42,0.62)",
      lineHeight: 1.25,
    },

    // Right info panel
    body: { padding: 16 },
    infoGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 10 },
    infoCard: {
      borderRadius: 14,
      border: "1px solid rgba(15,23,42,0.10)",
      background: "rgba(255,255,255,0.65)",
      padding: 12,
    },
    infoTitle: { margin: 0, fontSize: 13, fontWeight: 1000 as any, color: "#0f172a" },
    infoText: { marginTop: 6, fontSize: 12, fontWeight: 800, color: "rgba(15,23,42,0.65)", lineHeight: 1.35 },

    error: {
      padding: 12,
      borderRadius: 14,
      border: "1px solid rgba(239,68,68,0.22)",
      background: "rgba(239,68,68,0.08)",
      color: "#991B1B",
      fontWeight: 900,
      fontSize: 13,
      marginBottom: 12,
    },
    skeleton: {
      height: 14,
      borderRadius: 999,
      background: "rgba(15,23,42,0.08)",
      marginBottom: 10,
    },
  };

  const canDownload = !!data && data.status === "APPROVED" && data.paymentStatus === "PAID";

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.topBar}>
          <button style={S.btn} onClick={() => nav(-1)}>← Back</button>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              style={{ ...S.btn, ...S.btnPrimary, ...(canDownload ? {} : S.btnDisabled) }}
              onClick={onDownloadPdf}
              disabled={!canDownload}
              title={!canDownload ? "PDF is available only after APPROVED & PAID" : "Download PDF"}
            >
              Download PDF
            </button>
            <button style={S.btn} onClick={() => nav("/app/user/requests")}>My Requests</button>
          </div>
        </div>

        {err && <div style={S.error}>{err}</div>}

        <div style={window.innerWidth < 900 ? S.panel1col : S.panel}>
          {/* LEFT: Card Preview */}
          <div style={S.box}>
            <div style={S.boxHead}>
              <h3 style={S.h3}>License Card Preview</h3>
              <div style={S.small}>
                {loading ? "Loading..." : `Status: ${data?.status || "—"} • Payment: ${data?.paymentStatus || "—"}`}
              </div>
            </div>

            <div style={S.cardStage}>
              <div style={S.card}>
                <div style={S.cardPattern} />

                <div style={S.cardPad}>
                  {/* Header */}
                  <div style={S.cardHeader}>
                    <div style={S.govBlock}>
                      <div style={S.emblem} aria-hidden="true">
                        {/* simple emblem icon */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L20 6V12C20 17 16.5 20.5 12 22C7.5 20.5 4 17 4 12V6L12 2Z" stroke="rgba(15,23,42,0.70)" strokeWidth="1.6"/>
                          <path d="M8 12.2L10.6 14.8L16.2 9.2" stroke="rgba(34,197,94,0.95)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div style={S.govText}>
                        <div style={S.govTop}>THE FEDERAL REPUBLIC OF SOMALIA</div>
                        <div style={S.govSub}>Ministry of Transport</div>
                      </div>
                    </div>

                    <div style={{ ...S.badge, background: badge.bg, color: badge.color }}>
                      {badge.text}
                    </div>
                  </div>

                  {/* Title + license no */}
                  <div style={S.titleRow}>
                    <h2 style={S.title}>Driving License</h2>
                    <div style={S.licenseNo}>License No: {licenseNo}</div>
                  </div>

                  {/* Main */}
                  <div style={S.main}>
                    <div style={S.photo}>
                      {imageUrl ? (
                        <img src={imageUrl} alt="User" style={S.photoImg} />
                      ) : (
                        <div style={S.photoEmpty}>PHOTO</div>
                      )}
                    </div>

                    <div style={S.details}>
                      {loading ? (
                        <>
                          <div style={S.skeleton} />
                          <div style={S.skeleton} />
                          <div style={S.skeleton} />
                          <div style={S.skeleton} />
                          <div style={{ ...S.skeleton, width: "60%" }} />
                        </>
                      ) : (
                        <>
                          <div style={S.row}>
                            <div style={S.k}>Full Name</div>
                            <div style={S.v}>{data?.fullName || "—"}</div>
                          </div>
                          <div style={S.row}>
                            <div style={S.k}>Year of Birth</div>
                            <div style={S.v}>{data?.yearOfBirth ?? "—"}</div>
                          </div>
                          <div style={S.row}>
                            <div style={S.k}>Place of Birth</div>
                            <div style={S.v}>{data?.placeOfBirth || "—"}</div>
                          </div>
                          <div style={S.row}>
                            <div style={S.k}>Vehicle</div>
                            <div style={S.v}>{data?.vehicleName || "—"}</div>
                          </div>
                          <div style={{ ...S.row, ...S.rowLast }}>
                            <div style={S.k}>Category</div>
                            <div style={S.v}>{data?.vehicleType || "A1"}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom */}
                  <div style={S.bottomRow}>
                    <div style={S.footer}>
                      Issue Date: <span style={{ color: "#0f172a" }}>{formatDate(data?.createdAt)}</span>
                      <br />
                      Payment: <span style={{ color: "#0f172a" }}>{data?.paymentStatus || "—"}</span>
                    </div>

                    <div style={S.qr}>
                      QR CODE
                      <br />
                      Verify
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Instructions / Info */}
          <div style={S.box}>
            <div style={S.boxHead}>
              <h3 style={S.h3}>How it works</h3>
              <div style={S.small}>User → Pay → Admin approve → Download</div>
            </div>

            <div style={S.body}>
              <div style={S.infoGrid}>
                <div style={S.infoCard}>
                  <p style={S.infoTitle}>Download PDF</p>
                  <p style={S.infoText}>
                    PDF download works only when the request is <b>APPROVED</b> and payment is <b>PAID</b>.
                    If you see it disabled, ask admin to approve or complete payment.
                  </p>
                </div>

                <div style={S.infoCard}>
                  <p style={S.infoTitle}>Matching Fields</p>
                  <p style={S.infoText}>
                    Card shows: <b>Full Name</b>, <b>Year of Birth</b>, <b>Place of Birth</b>, <b>Vehicle</b>, <b>Category</b>,
                    and <b>Photo</b> (uploaded image).
                  </p>
                </div>

                <div style={S.infoCard}>
                  <p style={S.infoTitle}>Fix if image not showing</p>
                  <p style={S.infoText}>
                    Ensure backend serves uploads: <code>/uploads</code> static route,
                    and set <code>VITE_API_URL</code> to your backend base URL so images load correctly.
                  </p>
                </div>

                <div style={S.infoCard}>
                  <p style={S.infoTitle}>Go back</p>
                  <p style={S.infoText}>
                    If you opened this page by mistake, tap <b>Back</b> or go to <b>My Requests</b>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small note */}
        <div style={{ marginTop: 12, fontSize: 12, fontWeight: 800, color: "rgba(15,23,42,0.55)" }}>
          Tip: If you want the exact same design in the PDF, your backend PDFKit layout should use the same fields & spacing.
        </div>
      </div>
    </div>
  );
}
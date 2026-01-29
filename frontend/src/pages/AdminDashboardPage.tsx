import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthProvider";

type ReqStatus = "PENDING" | "APPROVED" | "REJECTED";
type PayStatus = "UNPAID" | "PAID";

type LicenseRequest = {
  _id: string;
  userId?: string;
  fullName: string;
  placeOfBirth: string;
  yearOfBirth: number;
  vehicleName: string;
  vehicleType?: string;
  status: ReqStatus;
  paymentStatus: PayStatus;
  createdAt: string;
  image?: string | null;
  payment?: {
    number: string;
    service: "EVC-PLUS" | "SAHAL" | "EDAHAB";
    fee: number;
    paidAmount: number;
    paidAt: string;
  } | null;
};

export default function AdminDashboardPage() {
  const nav = useNavigate();
  const { logout, theme, toggleTheme } = useAuth() as any;

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [list, setList] = useState<LicenseRequest[]>([]);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      // ✅ Admin endpoint (your server uses /api/admin with requireAdmin)
      // You MUST have backend route like: GET /api/admin/requests
      const res = await api.get<LicenseRequest[]>("/api/admin/requests");
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = list.length;
    const pending = list.filter((r) => r.status === "PENDING").length;
    const approved = list.filter((r) => r.status === "APPROVED").length;
    const rejected = list.filter((r) => r.status === "REJECTED").length;
    const paid = list.filter((r) => r.paymentStatus === "PAID").length;
    const unpaid = list.filter((r) => r.paymentStatus === "UNPAID").length;
    return { total, pending, approved, rejected, paid, unpaid };
  }, [list]);

  // simple “chart” bars from stats
  const chart = useMemo(() => {
    const clamp = (n: number) => Math.max(8, Math.min(95, n));
    const t = Math.max(1, stats.total);
    return [
      clamp((stats.pending / t) * 100),
      clamp((stats.approved / t) * 100),
      clamp((stats.rejected / t) * 100),
      clamp((stats.paid / t) * 100),
      clamp((stats.unpaid / t) * 100),
    ];
  }, [stats]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme || "dark");
  }, [theme]);

  const setStatus = async (id: string, status: ReqStatus) => {
    setErr("");
    setBusyId(id);
    try {
      // ✅ You MUST have backend endpoint:
      // PATCH /api/admin/requests/:id/status  body: { status: "APPROVED" | "REJECTED" }
      await api.patch(`/api/admin/requests/${id}/status`, { status });
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="page">
      <div className="container">
        {/* TOP BAR */}
        <div className="topbar glass">
          <div className="brand" onClick={() => nav("/app/admin/dashboard")} style={{ cursor: "pointer" }}>
            <div className="brand-badge" />
            <div>
              <div style={{ fontWeight: 900 }}>License System</div>
              <div className="muted" style={{ fontSize: 12 }}>
                Admin Dashboard • manage requests
              </div>
            </div>
          </div>

          <div className="top-actions">
            <button className="btn" onClick={toggleTheme}>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {err && <div className="alert alert-error">{err}</div>}

        {/* STATS */}
        <div className="grid grid-4" style={{ marginTop: 12 }}>
          <div className="card stat">
            <div className="stat-icon" />
            <div>
              <h3>Total</h3>
              <div className="value">{stats.total}</div>
              <div className="sub">Requests</div>
            </div>
          </div>

          <div className="card stat">
            <div className="stat-icon" />
            <div>
              <h3>Pending</h3>
              <div className="value">{stats.pending}</div>
              <div className="sub">Needs review</div>
            </div>
          </div>

          <div className="card stat">
            <div className="stat-icon" />
            <div>
              <h3>Approved</h3>
              <div className="value">{stats.approved}</div>
              <div className="sub">Accepted</div>
            </div>
          </div>

          <div className="card stat">
            <div className="stat-icon" />
            <div>
              <h3>Paid</h3>
              <div className="value">{stats.paid}</div>
              <div className="sub">Completed payments</div>
            </div>
          </div>
        </div>

        {/* CHART + CONTROLS */}
        <div className="grid grid-2" style={{ marginTop: 14 }}>
          <div className="card">
            <div className="panel-title">
              <h2>Overview</h2>
              <span className="muted" style={{ fontSize: 12 }}>
                distribution
              </span>
            </div>

            <div className="chart">
              <div className="chart-bars">
                {chart.map((v, i) => (
                  <div key={i} className="bar" style={{ height: `${v}%` }} />
                ))}
              </div>
              <div className="chart-legend">
                <span>Pending</span>
                <span>Approved</span>
                <span>Rejected</span>
                <span>Paid</span>
                <span>Unpaid</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="panel-title">
              <h2>Admin Actions</h2>
              <span className="muted" style={{ fontSize: 12 }}>
                manage data
              </span>
            </div>

            <div className="panel-body">
              <button className="btn btn-primary" onClick={load} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh List"}
              </button>

              <div className="hr" />

              <div className="muted">
                Approve/Reject only changes request <b>status</b>. Payment status is set by user payment endpoint.
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="card" style={{ marginTop: 14 }}>
          <div className="panel-title">
            <h2>All Requests</h2>
            <span className="muted" style={{ fontSize: 12 }}>
              {list.length} records
            </span>
          </div>

          <div className="panel-body">
            {loading ? (
              <div className="muted">
                <span className="loader" /> Loading requests...
              </div>
            ) : list.length === 0 ? (
              <div className="muted">No requests found.</div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Place</th>
                      <th>Year</th>
                      <th>Vehicle</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {list.map((r) => {
                      const busy = busyId === r._id;
                      return (
                        <tr key={r._id}>
                          <td className="td-strong">{r.fullName}</td>
                          <td>{r.placeOfBirth}</td>
                          <td>{r.yearOfBirth}</td>
                          <td>{r.vehicleName}</td>

                          <td>
                            <span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span>
                          </td>

                          <td>
                            <span className={`badge ${r.paymentStatus === "PAID" ? "paid" : "unpaid"}`}>
                              {r.paymentStatus}
                            </span>
                          </td>

                          <td className="actions">
                            <button
                              className="btn btn-success"
                              disabled={busy || r.status === "APPROVED"}
                              onClick={() => setStatus(r._id, "APPROVED")}
                            >
                              {busy ? "..." : "Approve"}
                            </button>

                            <button
                              className="btn btn-danger"
                              disabled={busy || r.status === "REJECTED"}
                              onClick={() => setStatus(r._id, "REJECTED")}
                            >
                              {busy ? "..." : "Reject"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

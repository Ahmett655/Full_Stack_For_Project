import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthProvider";

type ReqStatus = "PENDING" | "APPROVED" | "REJECTED";
type PayStatus = "UNPAID" | "PAID";

type LicenseRequest = {
  _id: string;
  fullName: string;
  placeOfBirth: string;
  yearOfBirth: number;
  vehicleName: string;
  vehicleType?: string;
  status: ReqStatus;
  paymentStatus: PayStatus;
  createdAt: string;
};

export default function UserDashboardHomePage() {
  const nav = useNavigate();
  const { user, logout, theme, toggleTheme } = useAuth() as any;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [list, setList] = useState<LicenseRequest[]>([]);

  // fetch requests for stats & small preview
  useEffect(() => {
    let mounted = true;
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await api.get<LicenseRequest[]>("/api/requests/my");
        if (!mounted) return;
        setList(Array.isArray(res.data) ? res.data : []);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = list.length;
    const approved = list.filter((r) => r.status === "APPROVED").length;
    const pending = list.filter((r) => r.status === "PENDING").length;
    const paid = list.filter((r) => r.paymentStatus === "PAID").length;
    return { total, approved, pending, paid };
  }, [list]);

  // Fake bar chart from last 7 items (or you can replace with real weekly logic)
  const chart = useMemo(() => {
    const base = [25, 45, 35, 60, 40, 75, 55];
    // slightly adjust based on total
    const bump = Math.min(20, stats.total * 2);
    return base.map((v) => Math.min(95, v + bump));
  }, [stats.total]);

  // Put theme on <html> (if your AuthProvider doesn't already do it)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme || "dark");
  }, [theme]);

  const preview = list.slice(0, 5);

  return (
    <div className="page">
      <div className="container">
        {/* TOP BAR */}
        <div className="topbar glass">
          <div className="brand" style={{ cursor: "pointer" }} onClick={() => nav("/app/user/dashboard")}>
            <div className="brand-badge" />
            <div>
              <div style={{ fontWeight: 900 }}>License System</div>
              <div className="muted" style={{ fontSize: 12 }}>
                User Dashboard {user?.email ? `• ${user.email}` : ""}
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
              <h3>Total Requests</h3>
              <div className="value">{stats.total}</div>
              <div className="sub">All time</div>
            </div>
          </div>

          <div className="card stat">
            <div className="stat-icon" />
            <div>
              <h3>Approved</h3>
              <div className="value">{stats.approved}</div>
              <div className="sub">Ready after paid</div>
            </div>
          </div>

          <div className="card stat">
            <div className="stat-icon" />
            <div>
              <h3>Pending</h3>
              <div className="value">{stats.pending}</div>
              <div className="sub">Awaiting admin</div>
            </div>
          </div>

          <div className="card stat">
            <div className="stat-icon" />
            <div>
              <h3>Paid</h3>
              <div className="value">{stats.paid}</div>
              <div className="sub">Payment completed</div>
            </div>
          </div>
        </div>

        {/* CHART + ACTIONS */}
        <div className="grid grid-2" style={{ marginTop: 14 }}>
          <div className="card">
            <div className="panel-title">
              <h2>Activity</h2>
              <span className="muted" style={{ fontSize: 12 }}>
                last overview
              </span>
            </div>
            <div className="chart">
              <div className="chart-bars">
                {chart.map((v, i) => (
                  <div key={i} className="bar" style={{ height: `${v}%` }} />
                ))}
              </div>
              <div className="chart-legend">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="panel-title">
              <h2>Quick Actions</h2>
              <span className="muted" style={{ fontSize: 12 }}>
                request & payments
              </span>
            </div>
            <div className="panel-body">
              <button className="btn btn-primary" onClick={() => nav("/app/user/request/new")}>
                + New Request (Form)
              </button>

              <div className="hr" />

              <button className="btn" onClick={() => nav("/app/user/requests")}>
                View My Requests (List)
              </button>

              <div className="hr" />

              <p className="muted" style={{ margin: 0 }}>
                Submit request → then Pay → admin approves → you can download your License Card PDF.
              </p>
            </div>
          </div>
        </div>

        {/* PREVIEW TABLE */}
        <div className="card" style={{ marginTop: 14 }}>
          <div className="panel-title">
            <h2>Recent Requests</h2>
            <span className="muted" style={{ fontSize: 12 }}>
              {list.length} total
            </span>
          </div>

          <div className="panel-body">
            {loading ? (
              <div className="muted">
                <span className="loader" /> Loading dashboard...
              </div>
            ) : preview.length === 0 ? (
              <div className="muted">No requests yet. Click “New Request (Form)” to start.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((r) => (
                    <tr key={r._id}>
                      <td>{r.fullName}</td>
                      <td>{r.vehicleName}</td>
                      <td>
                        <span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span>
                      </td>
                      <td>
                        <span className={`badge ${r.paymentStatus === "PAID" ? "paid" : "unpaid"}`}>
                          {r.paymentStatus}
                        </span>
                      </td>
                      <td>
                        {r.paymentStatus !== "PAID" ? (
                          <button className="btn btn-success" onClick={() => nav(`/app/user/pay/${r._id}`)}>
                            Pay
                          </button>
                        ) : (
                          <button className="btn" onClick={() => nav("/app/user/requests")}>
                            Open List
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="hr" />
            <button className="btn btn-ghost" onClick={() => nav("/app/user/requests")}>
              See all requests →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

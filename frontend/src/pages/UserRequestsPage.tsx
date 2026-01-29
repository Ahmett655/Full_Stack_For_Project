// frontend/src/pages/UserRequestsPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

type ReqItem = {
  _id: string;
  fullName: string;
  vehicleName?: string;
  vehicleType?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  paymentStatus: "UNPAID" | "PAID";
};

export default function UserRequestsPage() {
  const nav = useNavigate();

  const { data = [], isLoading, refetch } = useQuery<ReqItem[]>({
    queryKey: ["my-requests"],
    queryFn: async () => {
      const res = await api.get("/api/requests/my");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const downloadPdf = async (id: string) => {
    try {
      const res = await api.get(`/api/requests/${id}/pdf`, { responseType: "blob" });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `license-card-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.response?.data?.message || "PDF download failed");
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="card success-wrap">
          <div className="spinner" />
          <div className="hint">Loading requests…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header-row">
        <h2 className="page-title">My Requests</h2>

        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => nav("/app/user/dashboard")}>
            Back
          </button>
          <button className="btn" onClick={() => nav("/app/user/request/new")}>
            New Request
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((r) => {
                const vehicle = r.vehicleName || r.vehicleType || "-";
                const canDownload = r.status === "APPROVED" && r.paymentStatus === "PAID";

                return (
                  <tr key={r._id}>
                    <td>{r.fullName}</td>
                    <td>{vehicle}</td>
                    <td>
                      <span
                        className={
                          r.status === "APPROVED"
                            ? "badge badge-success"
                            : r.status === "REJECTED"
                            ? "badge badge-danger"
                            : "badge badge-warning"
                        }
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <span className={r.paymentStatus === "PAID" ? "badge badge-success" : "badge badge-warning"}>
                        {r.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {r.paymentStatus !== "PAID" ? (
                        <button className="btn btn-sm btn-primary" onClick={() => nav(`/app/user/pay/${r._id}`)}>
                          Pay
                        </button>
                      ) : (
                        <span className="hint">Paid</span>
                      )}

                      {canDownload && (
                        <button className="btn btn-sm" style={{ marginLeft: 8 }} onClick={() => downloadPdf(r._id)}>
                          Download License Card
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="hint">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 10 }}>
          <button className="btn btn-ghost" onClick={() => refetch()}>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

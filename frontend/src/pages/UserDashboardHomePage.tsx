// frontend/src/pages/UserDashboardHomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function UserDashboardHomePage() {
  const nav = useNavigate();
  const { logout } = useAuth();

  return (
    <div
      className="container"
      style={{
        padding: "32px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* ===== Header ===== */}
      <div
        className="header-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <h2
          className="page-title"
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          User Dashboard
        </h2>

        <button
          className="btn btn-ghost"
          style={{
            padding: "10px 16px",
          }}
          onClick={() => {
            logout();
            nav("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* ===== Cards ===== */}
      <div
        className="grid-2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 28, // ✅ space between cards
        }}
      >
        {/* ===== Request Form Card ===== */}
        <div
          className="card option-card"
          role="button"
          tabIndex={0}
          onClick={() => nav("/app/user/request/new")}
          style={{
            padding: "26px 28px", // ✅ space gudaha card-ka
            cursor: "pointer",
          }}
        >
          <h3
            className="card-title"
            style={{
              marginTop: 0,
              marginBottom: 12,
              fontSize: 20,
            }}
          >
            Request Form
          </h3>

          <p
            className="hint"
            style={{
              marginBottom: 20, // ✅ qoraalka darbiga kama dhagana
              lineHeight: 1.6,
            }}
          >
            Fill the form and submit your license card request.
          </p>

          <button
            className="btn btn-primary"
            style={{
              marginTop: 10,
              padding: "10px 18px",
            }}
          >
            Open Form
          </button>
        </div>

        {/* ===== Request List Card ===== */}
        <div
          className="card option-card"
          role="button"
          tabIndex={0}
          onClick={() => nav("/app/user/requests")}
          style={{
            padding: "26px 28px",
            cursor: "pointer",
          }}
        >
          <h3
            className="card-title"
            style={{
              marginTop: 0,
              marginBottom: 12,
              fontSize: 20,
            }}
          >
            Request List
          </h3>

          <p
            className="hint"
            style={{
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            View your submitted requests, payment status, and download card.
          </p>

          <button
            className="btn"
            style={{
              marginTop: 10,
              padding: "10px 18px",
            }}
          >
            View Requests
          </button>
        </div>
      </div>
    </div>
  );
}

// frontend/src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import ProtectedRoute from "./auth/ProtectedRoute";

import AdminDashboardPage from "./pages/AdminDashboardPage";

import UserDashboardHomePage from "./pages/UserDashboardHomePage";
import UserRequestNewPage from "./pages/UserRequestNewPage";
import UserRequestsPage from "./pages/UserRequestsPage";
import LicenseCardPreviewPage from "./pages/LicenseCardPreviewPage";
import PaymentPage from "./features/PaymentPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      // Example
      <Route path="/app/user/requests/:id/card" element={<LicenseCardPreviewPage />} />

      {/* USER */}
      <Route
        path="/app/user/dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboardHomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/user/request/new"
        element={
          <ProtectedRoute role="user">
            <UserRequestNewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/user/requests"
        element={
          <ProtectedRoute role="user">
            <UserRequestsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/user/pay/:id"
        element={
          <ProtectedRoute role="user">
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/app/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

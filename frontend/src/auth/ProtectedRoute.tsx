import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

type Role = "user" | "admin";

export default function ProtectedRoute({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { token, user } = useAuth();

  // ✅ not logged in -> go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ role mismatch -> redirect based on actual role
  if (user.role !== role) {
    return (
      <Navigate
        to={user.role === "admin" ? "/app/admin/dashboard" : "/app/user/dashboard"}
        replace
      />
    );
  }

  return <>{children}</>;
}

import { Navigate } from "react-router-dom";

export default function RequireUser({ children }: { children: JSX.Element }) {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!userStr || !token) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  if (user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const errorMiddleware = require("./src/middleware/errorMiddleware");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const requestRoutes = require("./src/routes/requestRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

// RBAC routes
const roleRoutes = require("./src/routes/roleRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const permissionRoutes = require("./src/routes/permissionRoutes");
const rolePermissionRoutes = require("./src/routes/rolePermissionRoutes");

// ✅ NEW: auth & admin middleware
const requireAuth = require("./src/middleware/requireAuth");
const requireAdmin = require("./src/middleware/requireAdmin");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => res.send("License Backend Running ✅"));

// ✅ Public auth
app.use("/api/auth", authRoutes);

// ✅ Protected (user login required)
app.use("/api/requests", requireAuth, requestRoutes);
app.use("/api/payments", requireAuth, paymentRoutes);

// ✅ Admin only
app.use("/api/admin", requireAuth, requireAdmin, adminRoutes);

// ✅ RBAC admin only (optional, but recommended)
app.use("/api/roles", requireAuth, requireAdmin, roleRoutes);
app.use("/api/menus", requireAuth, requireAdmin, menuRoutes);
app.use("/api/permissions", requireAuth, requireAdmin, permissionRoutes);
app.use("/api/role-permissions", requireAuth, requireAdmin, rolePermissionRoutes);
app.use("/uploads", express.static("uploads"));


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

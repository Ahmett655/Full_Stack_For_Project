module.exports = function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const role = String(req.user.role || "user").toLowerCase();
  if (role !== "admin") return res.status(403).json({ message: "Admin only" });

  next();
};

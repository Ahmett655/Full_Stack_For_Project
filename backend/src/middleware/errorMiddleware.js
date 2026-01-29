const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
};

module.exports = (err, req, res, next) => {
  console.error("🔥 ERROR:", err); // ✅ muhiim

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Server error",
  });
};

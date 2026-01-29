const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

// ✅ accept only jpg/jpeg/png
function fileFilter(req, file, cb) {
  const ok = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
  if (!ok) return cb(new Error("Only JPG/PNG images are allowed"), false);
  cb(null, true);
}

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});

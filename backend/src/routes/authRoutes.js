const router = require("express").Router();
const auth = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/me", requireAuth, auth.me);

// ✅ ADD THESE:
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);

module.exports = router;
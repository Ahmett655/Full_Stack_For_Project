const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");

// ===============================
// JWT HELPER
// ===============================
function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );
}

// ===============================
// REGISTER
// ===============================
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, password are required" });
    }

    const exists = await User.findOne({
      email: String(email).toLowerCase(),
    });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: String(email).toLowerCase(),
      password: hash,
      role: "user",
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase(),
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// ME (GET CURRENT USER)
// ===============================
exports.me = async (req, res) => {
  // requireAuth middleware ayaa req.user gelinaya
  res.json(req.user);
};

// ===============================
// FORGOT PASSWORD
// ===============================
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase(),
    });

    // SECURITY: hadduu jiro ama uusan jirin labadaba isku jawaab
    if (!user) {
      return res.json({ message: "If email exists, reset link sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Hadda email ma dirayno – console kaliya
    console.log("🔐 RESET PASSWORD LINK:", link);

    res.json({ message: "Reset link sent" });
  } catch (err) {
    next(err);
  }
};

// ===============================
// RESET PASSWORD
// ===============================
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
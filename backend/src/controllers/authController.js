const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "If email exists, reset link sent" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 1000 * 60 * 15; // 15 min
  await user.save();

  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  console.log("RESET LINK:", link); // hadda email ma dirayno

  res.json({ message: "Reset link sent" });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: "Password updated" });
};
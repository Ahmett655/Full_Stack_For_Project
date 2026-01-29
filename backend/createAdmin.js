require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/user"); // waafaji haddii model magac kale

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@gmail.com";
  const passwordPlain = "123456";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists ✅");
    process.exit(0);
  }

  const hashed = await bcrypt.hash(passwordPlain, 10);

  await User.create({
    name: "Admin",
    email,
    password: hashed,
    role: "admin",
  });

  console.log("✅ Admin created:");
  console.log("Email:", email);
  console.log("Password:", passwordPlain);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

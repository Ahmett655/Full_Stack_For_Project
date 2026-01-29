const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "LicenseRequest", required: true },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },

    method: {
      type: String,
      enum: ["EVCPLUS", "SAHAL", "EDAHAB", "CASH", "CARD", "BANK"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
    },

    reference: { type: String, trim: true },
    description: { type: String, trim: true },

    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);

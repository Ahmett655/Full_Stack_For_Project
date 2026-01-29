const mongoose = require("mongoose");

/**
 * Embedded payment info (saved when user pays)
 * Fee is fixed at 150 (backend controller enforces it)
 */
const PaymentSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    service: {
      type: String,
      enum: ["EVC-PLUS", "SAHAL", "EDAHAB"],
      required: true,
    },
    fee: { type: Number, required: true },        // e.g. 150
    paidAmount: { type: Number, required: true }, // user entered amount
    paidAt: { type: Date, required: true },
  },
  { _id: false }
);

const LicenseRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Request form fields
    fullName: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    yearOfBirth: { type: Number, required: true },

    vehicleName: { type: String, required: true }, // "name of vehicle"
    vehicleType: { type: String, default: "" },    // optional (if you use it)

    // ✅ Image upload (multer saves /uploads/<filename>)
    image: { type: String, default: null },

    // Status flow
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    // Payment state
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID"],
      default: "UNPAID",
    },

    // Payment details
    payment: { type: PaymentSchema, default: null },
  },
  { timestamps: true }
);

/**
 * ✅ IMPORTANT: Prevent OverwriteModelError in nodemon/dev reload
 */
module.exports =
  mongoose.models.LicenseRequest ||
  mongoose.model("LicenseRequest", LicenseRequestSchema);

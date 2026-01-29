const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. VIEW_USERS, CREATE_REQUEST
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  },
  { timestamps: true }
);

permissionSchema.index({ name: 1, menuId: 1 }, { unique: true });

module.exports = mongoose.model("Permission", permissionSchema);

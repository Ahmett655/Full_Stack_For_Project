const LicenseRequest = require("../models/licenseRequest");

exports.payForRequest = async (req, res, next) => {
  try {
    const { id } = req.params; // requestId
    const userId = req.user?._id || req.user?.id;

    // ✅ frontend sends: number, provider, amount
    const { number, provider, amount } = req.body;

    if (!number || !provider) {
      return res.status(400).json({ message: "number and provider are required" });
    }

    const r = await LicenseRequest.findById(id);
    if (!r) return res.status(404).json({ message: "Request not found" });

    // ✅ owner check
    if (String(r.userId) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const fee = 150;
    const paidAmount = Number(amount || 150); // user entered
    // NOTE: you said: if more than 150, fee remains 150. (paidAmount stays what user typed)

    r.paymentStatus = "PAID";
    r.payment = {
      number,
      service: provider, // ✅ map provider -> service for schema
      fee,
      paidAmount,
      paidAt: new Date(),
    };

    await r.save();

    res.json({ message: "Payment successful", request: r });
  } catch (err) {
    next(err);
  }
};

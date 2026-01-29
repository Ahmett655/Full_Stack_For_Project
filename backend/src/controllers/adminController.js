const LicenseRequest = require("../models/licenseRequest");

exports.listRequests = async (req, res, next) => {
  try {
    const list = await LicenseRequest.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.setStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const doc = await LicenseRequest.findById(id);
    if (!doc) return res.status(404).json({ message: "Request not found" });

    doc.status = status;
    await doc.save();

    const fresh = await LicenseRequest.findById(id);
    res.json({ message: "Updated", request: fresh });
  } catch (err) {
    next(err);
  }
};

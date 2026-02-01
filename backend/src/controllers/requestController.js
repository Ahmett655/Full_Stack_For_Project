const LicenseRequest = require("../models/licenseRequest");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

/**
 * ===============================
 * CREATE REQUEST (USER)
 * ===============================
 */
exports.createRequest = async (req, res, next) => {
  try {
    const {
      fullName,
      placeOfBirth,
      yearOfBirth,
      vehicleName,
      vehicleType,
    } = req.body;

    if (!fullName || !placeOfBirth || !yearOfBirth || !vehicleName) {
      return res.status(400).json({
        message: "fullName, placeOfBirth, yearOfBirth, vehicleName are required",
      });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const request = await LicenseRequest.create({
      userId: req.user._id,
      fullName,
      placeOfBirth,
      yearOfBirth,
      vehicleName,
      vehicleType: vehicleType || "",
      image: imagePath,
      status: "PENDING",
      paymentStatus: "UNPAID",
    });

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

/**
 * ===============================
 * GET MY REQUESTS (USER)
 * ===============================
 */
exports.getMyRequests = async (req, res, next) => {
  try {
    const list = await LicenseRequest.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    next(err);
  }
};

/**
 * ===============================
 * GET SINGLE REQUEST
 * ===============================
 */
exports.getRequestById = async (req, res, next) => {
  try {
    const r = await LicenseRequest.findById(req.params.id);
    if (!r) return res.status(404).json({ message: "Request not found" });

    if (String(r.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(r);
  } catch (err) {
    next(err);
  }
};

/**
 * ===============================
 * UPDATE REQUEST STATUS (ADMIN)
 * ===============================
 */
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await LicenseRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.json({
      message: "Request status updated successfully",
      request,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ===============================
 * DOWNLOAD LICENSE CARD PDF
 * ===============================
 */

exports.downloadRequestPdf = async (req, res, next) => {
  console.log("✅ PDF CONTROLLER RUNNING (NEW) ✅");
  try {
    const { id } = req.params;

    const r = await LicenseRequest.findById(id);
    if (!r) return res.status(404).json({ message: "Request not found" });

    if (String(r.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (r.status !== "APPROVED" || r.paymentStatus !== "PAID") {
      return res
        .status(400)
        .json({ message: "License available only after APPROVED & PAID" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=license-card.pdf"
    );

    const doc = new PDFDocument({ size: [350, 220], margin: 12 });
    doc.pipe(res);

    doc.rect(0, 0, 350, 220).fill("#cfe9f6");

    doc.fillColor("#003366").fontSize(13)
      .text("THE FEDERAL REPUBLIC OF SOMALIA", 20, 12);

    doc.fontSize(11).text("DRIVING LICENCE", 20, 30);

    if (r.image) {
      const imgPath = path.join(process.cwd(), r.image.replace("/uploads/", "uploads/"));
      if (fs.existsSync(imgPath)) {
        doc.image(imgPath, 20, 55, { width: 70, height: 90 });
      }
    }

    doc.fillColor("#000").fontSize(9);
    let y = 55;
    const x = 110;

    doc.text("Names", x, y).text(r.fullName, x, y + 12);
    y += 28;
    doc.text("Date of Birth", x, y).text(String(r.yearOfBirth), x, y + 12);
    y += 28;
    doc.text("Place of Birth", x, y).text(r.placeOfBirth, x, y + 12);
    y += 28;
    doc.text("Vehicle", x, y).text(r.vehicleName, x, y + 12);

    doc.end();
  } catch (err) {
    next(err);
  }
};
// ✅ ADMIN: Get all requests
exports.getAllRequests = async (req, res, next) => {
  try {
    const list = await LicenseRequest.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    next(err);
  }
};

// ✅ ADMIN: Update request status
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await LicenseRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    res.json({ message: "Status updated", request });
  } catch (err) {
    next(err);
  }
};
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
      payment: null,
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
 * DOWNLOAD LICENSE CARD PDF
 * ===============================
 */
exports.downloadRequestPdf = async (req, res, next) => {
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

    // ===== PDF HEADERS =====
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=license-card.pdf"
    );

    const doc = new PDFDocument({
      size: [350, 220],
      margin: 12,
    });

    doc.pipe(res);

    // ===== BACKGROUND =====
    doc.rect(0, 0, 350, 220).fill("#cfe9f6");

    // ===== HEADER =====
    doc
      .fillColor("#003366")
      .fontSize(13)
      .text("THE FEDERAL REPUBLIC OF SOMALIA", 20, 12);

    doc
      .fontSize(11)
      .text("DRIVING LICENCE", 20, 30);

    // ===== PHOTO =====
    if (r.image) {
      const imgPath = path.join(process.cwd(), r.image.replace("/uploads/", "uploads/"));
      if (fs.existsSync(imgPath)) {
        doc.image(imgPath, 20, 55, { width: 70, height: 90 });
      } else {
        doc.rect(20, 55, 70, 90).stroke();
        doc.fontSize(8).text("No Image", 35, 95);
      }
    } else {
      doc.rect(20, 55, 70, 90).stroke();
      doc.fontSize(8).text("No Image", 35, 95);
    }

    // ===== DETAILS =====
    doc.fillColor("#000").fontSize(9);

    let y = 55;
    const x = 110;

    doc.text("Names", x, y);
    doc.text(r.fullName.toUpperCase(), x, y + 12);

    y += 28;
    doc.text("Date of Birth", x, y);
    doc.text(String(r.yearOfBirth), x, y + 12);

    y += 28;
    doc.text("Place of Birth", x, y);
    doc.text(r.placeOfBirth, x, y + 12);

    y += 28;
    doc.text("Vehicle", x, y);
    doc.text(r.vehicleName, x, y + 12);

    y += 28;
    doc.text("Category", x, y);
    doc.text(r.vehicleType || "A1", x, y + 12);

    // ===== FOOTER =====
    doc
      .fontSize(8)
      .text("Issued by Ministry of Transport", 20, 190);

    doc
      .fontSize(7)
      .text(
        `License No: ${r._id.toString().slice(-8)}`,
        220,
        190
      );

    doc.end();
  } catch (err) {
    next(err);
  }
};

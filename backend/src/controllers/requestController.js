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
    const { fullName, placeOfBirth, yearOfBirth, vehicleName, vehicleType } =
      req.body;

    if (!fullName || !placeOfBirth || !yearOfBirth || !vehicleName) {
      return res.status(400).json({
        message:
          "fullName, placeOfBirth, yearOfBirth, vehicleName are required",
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
    const list = await LicenseRequest.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(list);
  } catch (err) {
    next(err);
  }
};

/**
 * ===============================
 * GET SINGLE REQUEST (USER)
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
 * ADMIN: GET ALL REQUESTS
 * ===============================
 */
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

/**
 * ===============================
 * ADMIN: UPDATE REQUEST STATUS
 * (HAL MAR KALIYA)
 * ===============================
 */
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

/**
 * ===============================
 * DOWNLOAD LICENSE CARD PDF
 * ===============================
 */
exports.downloadRequestPdf = async (req, res, next) => {
  let doc; // si aan u xakameyno haddii error dhaco
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

    console.log("✅ PDF CONTROLLER RUNNING (NEW) ✅");

    // ===== PDF HEADERS =====
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=license-card-${r._id.toString().slice(-8)}-${Date.now()}.pdf`
    );

    // Card size (landscape)
    const W = 620;
    const H = 360;

    doc = new PDFDocument({ size: [W, H], margin: 0 });

    // haddii PDFKit error dhaco → next(err)
    doc.on("error", (e) => next(e));

    // pipe response
    doc.pipe(res);

    // Helpers
    const safe = (v) =>
      v === null || v === undefined || v === "" ? "—" : String(v);
    const licenseNo = r._id.toString().slice(-8).toUpperCase();

    // ===== BACKGROUND =====
    doc.rect(0, 0, W, H).fill("#EAF6FF");
    doc.save();
    doc.fillColor("#CFE9F6").rect(0, H * 0.45, W, H * 0.25).fill();
    doc.restore();

    // subtle pattern circles
    doc.save();
    doc.fillColor("#D9EEFA").circle(120, 90, 90).fill();
    doc.fillColor("#DFF5EA").circle(520, 110, 110).fill();
    doc.restore();

    // main card border
    doc.save();
    doc.roundedRect(14, 14, W - 28, H - 28, 18).lineWidth(1).stroke("#B8D7EA");
    doc.restore();

    // ===== HEADER =====
    const pad = 26;
    const headerY = 28;

    // emblem box
    doc.save();
    doc
      .roundedRect(pad, headerY, 46, 46, 14)
      .fillAndStroke("#EAF2FF", "#BBD2F3");
    doc.restore();

    /**
     * ✅ FIX: PDFKit MA LAHA curveTo()
     * Emblem fudud oo safe ah:
     */
    doc.save();
    doc.fillColor("#1E3A8A");
    doc.circle(pad + 23, headerY + 23, 8).fill();
    doc.restore();

    doc
      .fillColor("#0F172A")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("THE FEDERAL REPUBLIC OF SOMALIA", pad + 60, headerY + 6);

    doc
      .fillColor("#334155")
      .font("Helvetica")
      .fontSize(10)
      .text("Ministry of Transport", pad + 60, headerY + 24);

    // status badge
    const badgeText =
      r.status === "APPROVED" && r.paymentStatus === "PAID"
        ? "VALID"
        : r.status === "REJECTED"
        ? "REJECTED"
        : "PENDING";

    let badgeFill = "#FEF3C7",
      badgeStroke = "#F59E0B",
      badgeTextColor = "#92400E";
    if (badgeText === "VALID") {
      badgeFill = "#DCFCE7";
      badgeStroke = "#22C55E";
      badgeTextColor = "#166534";
    }
    if (badgeText === "REJECTED") {
      badgeFill = "#FEE2E2";
      badgeStroke = "#EF4444";
      badgeTextColor = "#991B1B";
    }

    const badgeW = 90;
    const badgeH = 26;
    const badgeX = W - pad - badgeW;
    const badgeY = headerY + 10;

    doc.save();
    doc
      .roundedRect(badgeX, badgeY, badgeW, badgeH, 13)
      .fillAndStroke(badgeFill, badgeStroke);
    doc
      .fillColor(badgeTextColor)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(badgeText, badgeX, badgeY + 7, { width: badgeW, align: "center" });
    doc.restore();

    // ===== TITLE ROW =====
    const titleY = 86;

    doc
      .fillColor("#1E3A8A")
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("DRIVING LICENSE", pad, titleY);

    // license no pill
    const pillText = `License No: ${licenseNo}`;
    doc.save();
    doc
      .roundedRect(W - pad - 200, titleY - 2, 200, 26, 12)
      .fillAndStroke("#FFFFFF", "#C7D2FE");
    doc
      .fillColor("#0F172A")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(pillText, W - pad - 200, titleY + 6, {
        width: 200,
        align: "center",
      });
    doc.restore();

    // ===== MAIN =====
    const mainY = 122;
    const leftX = pad;
    const photoW = 170;
    const photoH = 165;

    // Photo frame
    doc.save();
    doc
      .roundedRect(leftX, mainY, photoW, photoH, 16)
      .fillAndStroke("#FFFFFF", "#B8D7EA");
    doc.restore();

    // Put image if exists
    if (r.image) {
      // r.image like "/uploads/xxx.jpg"
      const filename = path.basename(r.image);
      const imgPath = path.join(process.cwd(), "uploads", filename);

      if (fs.existsSync(imgPath)) {
        doc.save();
        doc.roundedRect(leftX, mainY, photoW, photoH, 16).clip();
        doc.image(imgPath, leftX, mainY, { width: photoW, height: photoH });
        doc.restore();
      } else {
        doc
          .fillColor("#64748B")
          .font("Helvetica-Bold")
          .fontSize(11)
          .text("PHOTO", leftX, mainY + photoH / 2 - 6, {
            width: photoW,
            align: "center",
          });
      }
    } else {
      doc
        .fillColor("#64748B")
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("PHOTO", leftX, mainY + photoH / 2 - 6, {
          width: photoW,
          align: "center",
        });
    }

    // Details box
    const detailsX = leftX + photoW + 16;
    const detailsW = W - pad - detailsX;
    const detailsH = photoH;

    doc.save();
    doc
      .roundedRect(detailsX, mainY, detailsW, detailsH, 16)
      .fillAndStroke("#FFFFFF", "#B8D7EA");
    doc.restore();

    // detail rows
    const rows = [
      ["Full Name", safe(r.fullName)],
      ["Year of Birth", safe(r.yearOfBirth)],
      ["Place of Birth", safe(r.placeOfBirth)],
      ["Vehicle", safe(r.vehicleName)],
      ["Category", safe(r.vehicleType || "A1")],
    ];

    let ry = mainY + 14;
    const keyX = detailsX + 14;
    const valX = detailsX + 150;

    rows.forEach((row, i) => {
      doc
        .fillColor("#475569")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(row[0], keyX, ry);

      doc
        .fillColor("#0F172A")
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(String(row[1]), valX, ry);

      if (i !== rows.length - 1) {
        const lineY = ry + 22;
        doc.save();
        doc.strokeColor("#CBD5E1").dash(3, { space: 3 });
        doc
          .moveTo(detailsX + 14, lineY)
          .lineTo(detailsX + detailsW - 14, lineY)
          .stroke();
        doc.undash();
        doc.restore();
      }

      ry += 30;
    });

    // ===== FOOTER =====
    const footY = mainY + photoH + 18;

    doc
      .fillColor("#334155")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Issued by Ministry of Transport", pad, footY);

    doc
      .fillColor("#64748B")
      .font("Helvetica")
      .fontSize(9)
      .text(`Payment: ${safe(r.paymentStatus)}`, pad, footY + 14);

    // QR placeholder
    const qrSize = 74;
    doc.save();
    doc
      .roundedRect(W - pad - qrSize, footY - 6, qrSize, qrSize, 14)
      .fillAndStroke("#FFFFFF", "#B8D7EA");
    doc
      .fillColor("#94A3B8")
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("QR\nVERIFY", W - pad - qrSize, footY + 18, {
        width: qrSize,
        align: "center",
      });
    doc.restore();

    doc.end();
  } catch (err) {
    // haddii response la bilaabay, ha isku dayin json
    try {
      if (doc) doc.end();
    } catch {}
    next(err);
  }
};
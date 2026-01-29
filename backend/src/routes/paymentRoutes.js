const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

// ✅ POST /api/payments/:id
router.post("/:id", paymentController.payForRequest);

module.exports = router;

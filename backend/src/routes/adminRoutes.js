const express = require("express");
const router = express.Router();

const requestController = require("../controllers/requestController");

// ✅ List all requests (admin)
router.get("/requests", requestController.getAllRequests);

// ✅ Update status (admin)
router.patch("/requests/:id/status", requestController.updateRequestStatus);

module.exports = router;
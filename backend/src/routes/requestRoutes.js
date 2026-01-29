const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const upload = require("../middleware/upload");
const requestController = require("../controllers/requestController");

router.post("/", requireAuth, upload.single("image"), requestController.createRequest);

router.get("/my", requireAuth, requestController.getMyRequests);
router.get("/:id/pdf", requireAuth, requestController.downloadRequestPdf);
router.get("/:id", requireAuth, requestController.getRequestById);

// ✅ ADD THIS (Approve/Reject)
router.patch(
  "/admin/requests/:id/status",
  requireAuth,
  requestController.updateRequestStatus
);

module.exports = router;
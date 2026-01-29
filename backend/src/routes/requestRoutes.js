const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const upload = require("../middleware/upload"); // ✅ this must exist
const requestController = require("../controllers/requestController"); // ✅ this must exist

// ✅ Debug (optional): remove after you confirm server runs
// console.log("requireAuth:", typeof requireAuth);
// console.log("upload:", upload && typeof upload.single);
// console.log("createRequest:", typeof requestController.createRequest);

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  requestController.createRequest
);

router.get("/my", requireAuth, requestController.getMyRequests);
router.get("/:id/pdf", requireAuth, requestController.downloadRequestPdf);
router.get("/:id", requireAuth, requestController.getRequestById);

module.exports = router;

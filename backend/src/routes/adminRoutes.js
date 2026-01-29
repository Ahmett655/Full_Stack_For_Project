const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/requests", adminController.listRequests);
router.put("/requests/:id/status", adminController.setStatus);

module.exports = router;

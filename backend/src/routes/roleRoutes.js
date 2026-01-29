const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const c = require("../controllers/roleController");

router.post("/", auth, admin, c.createRole);
router.get("/", auth, admin, c.getRoles);
router.get("/:id", auth, admin, c.getRoleById);
router.put("/:id", auth, admin, c.updateRole);
router.delete("/:id", auth, admin, c.deleteRole);

module.exports = router;

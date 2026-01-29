const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const c = require("../controllers/permissionController");

router.post("/", auth, admin, c.createPermission);
router.get("/", auth, admin, c.getPermissions);
router.put("/:id", auth, admin, c.updatePermission);
router.delete("/:id", auth, admin, c.deletePermission);

module.exports = router;

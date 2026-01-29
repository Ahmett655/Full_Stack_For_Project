const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const c = require("../controllers/menuController");

router.post("/", auth, admin, c.createMenu);
router.get("/", auth, admin, c.getMenus);
router.put("/:id", auth, admin, c.updateMenu);
router.delete("/:id", auth, admin, c.deleteMenu);

module.exports = router;

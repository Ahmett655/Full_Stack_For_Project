const express = require("express");
const router = express.Router();

const {
  assignPermissionToRole,
  getAllRolePermissions,
  getPermissionsByRole,
  deleteRolePermission,
} = require("../controllers/rolePermissionController");

router.post("/", assignPermissionToRole);
router.get("/", getAllRolePermissions);
router.get("/role/:roleId", getPermissionsByRole);
router.delete("/:id", deleteRolePermission);

module.exports = router;

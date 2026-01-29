// src/controllers/rolePermissionController.js
const RolePermission = require("../models/rolePermissionModel");

// Assign permission to role
exports.assignPermissionToRole = async (req, res, next) => {
  try {
    const { roleId, permissionId } = req.body;

    if (!roleId || !permissionId) {
      return res.status(400).json({ message: "roleId and permissionId are required" });
    }

    // prevent duplicate
    const exists = await RolePermission.findOne({ roleId, permissionId });
    if (exists) {
      return res.status(400).json({ message: "Permission already assigned to this role" });
    }

    const rp = await RolePermission.create({ roleId, permissionId });
    res.status(201).json(rp);
  } catch (err) {
    next(err);
  }
};

// Get all role-permissions
exports.getAllRolePermissions = async (req, res, next) => {
  try {
    const list = await RolePermission.find()
      .populate("roleId", "name")
      .populate("permissionId", "name menuId");

    res.json(list);
  } catch (err) {
    next(err);
  }
};

// Get permissions by roleId
exports.getPermissionsByRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;

    const list = await RolePermission.find({ roleId })
      .populate("permissionId", "name menuId");

    res.json(list);
  } catch (err) {
    next(err);
  }
};

// Remove permission from role (by rolePermissionId)
exports.deleteRolePermission = async (req, res, next) => {
  try {
    const deleted = await RolePermission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "RolePermission not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const Role = require("../models/role");

exports.createRole = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const exists = await Role.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ message: "Role already exists" });

    const role = await Role.create({ name: name.trim() });
    res.status(201).json(role);
  } catch (e) { next(e); }
};

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (e) { next(e); }
};

exports.getRoleById = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (e) { next(e); }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { name } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (name) role.name = name.trim();
    await role.save();
    res.json(role);
  } catch (e) { next(e); }
};

exports.deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role deleted" });
  } catch (e) { next(e); }
};

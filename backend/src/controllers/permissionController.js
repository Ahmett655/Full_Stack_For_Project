const Permission = require("../models/permission");
const Menu = require("../models/menu");

exports.createPermission = async (req, res, next) => {
  try {
    const { name, menuId } = req.body;
    if (!name || !menuId) return res.status(400).json({ message: "name and menuId are required" });

    const menu = await Menu.findById(menuId);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const perm = await Permission.create({ name: name.trim(), menuId });
    res.status(201).json(perm);
  } catch (e) { next(e); }
};

exports.getPermissions = async (req, res, next) => {
  try {
    const perms = await Permission.find().populate("menuId", "name path").sort({ createdAt: -1 });
    res.json(perms);
  } catch (e) { next(e); }
};

exports.updatePermission = async (req, res, next) => {
  try {
    const perm = await Permission.findById(req.params.id);
    if (!perm) return res.status(404).json({ message: "Permission not found" });

    const { name, menuId } = req.body;
    if (name) perm.name = name.trim();
    if (menuId) perm.menuId = menuId;

    await perm.save();
    res.json(perm);
  } catch (e) { next(e); }
};

exports.deletePermission = async (req, res, next) => {
  try {
    const perm = await Permission.findByIdAndDelete(req.params.id);
    if (!perm) return res.status(404).json({ message: "Permission not found" });
    res.json({ message: "Permission deleted" });
  } catch (e) { next(e); }
};

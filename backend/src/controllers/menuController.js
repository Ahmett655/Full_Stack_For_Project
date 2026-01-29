const Menu = require("../models/menu");

exports.createMenu = async (req, res, next) => {
  try {
    const { name, path, parentId } = req.body;
    if (!name || !path) return res.status(400).json({ message: "name and path are required" });

    const menu = await Menu.create({ name: name.trim(), path: path.trim(), parentId: parentId || null });
    res.status(201).json(menu);
  } catch (e) { next(e); }
};

exports.getMenus = async (req, res, next) => {
  try {
    const menus = await Menu.find().sort({ createdAt: -1 });
    res.json(menus);
  } catch (e) { next(e); }
};

exports.updateMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const { name, path, parentId } = req.body;
    if (name) menu.name = name.trim();
    if (path) menu.path = path.trim();
    if (parentId !== undefined) menu.parentId = parentId || null;

    await menu.save();
    res.json(menu);
  } catch (e) { next(e); }
};

exports.deleteMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.json({ message: "Menu deleted" });
  } catch (e) { next(e); }
};

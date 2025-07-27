const { Op } = require('sequelize');
// Corrected Imports:
const InventoryMovement = require('../models/inventoryMovement.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

exports.getLogs = async (req, res) => {
  try {
    const { type } = req.query; // Example: filter by action type
    let whereClause = {};

    if (type) {
      whereClause.type = type;
    }

    const logs = await InventoryMovement.findAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['name'] },
        { model: Product, attributes: ['name', 'sku'] },
      ],
      order: [['createdAt', 'DESC']], // Show newest logs first
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
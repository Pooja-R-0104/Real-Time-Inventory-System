const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InventoryMovement = sequelize.define('InventoryMovement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
    allowNull: false,
  },
  quantityChange: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stockAfter: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // We'll add foreign keys for product and user
});

module.exports = InventoryMovement;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  barcode: { // <-- NEW FIELD
    type: DataTypes.STRING,
    allowNull: true, // Making it optional
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  threshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
  expiryDate: { // <-- NEW FIELD
    type: DataTypes.DATEONLY, // Stores date as YYYY-MM-DD
    allowNull: true, // Making it optional
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Product;
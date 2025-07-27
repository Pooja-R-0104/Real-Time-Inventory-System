const { Parser } = require('json2csv');
const Product = require('../models/product.model');
const InventoryMovement = require('../models/inventoryMovement.model');
const User = require('../models/user.model');

exports.exportProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ raw: true });
    const fields = ['id', 'name', 'category', 'price', 'stock', 'threshold', 'sku', 'barcode', 'expiryDate'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(products);

    res.header('Content-Type', 'text/csv');
    res.attachment('products.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting products', error: error.message });
  }
};

exports.exportLogs = async (req, res) => {
  try {
    const logs = await InventoryMovement.findAll({
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Product, attributes: ['name', 'sku'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    
    // Flatten the data for CSV export
    const flattenedLogs = logs.map(log => ({
      id: log.id,
      type: log.type,
      quantityChange: log.quantityChange,
      stockAfter: log.stockAfter,
      createdAt: log.createdAt,
      userName: log.User ? log.User.name : 'N/A',
      userEmail: log.User ? log.User.email : 'N/A',
      productName: log.Product ? log.Product.name : 'N/A',
      productSku: log.Product ? log.Product.sku : 'N/A',
    }));

    const fields = ['id', 'type', 'quantityChange', 'stockAfter', 'createdAt', 'userName', 'userEmail', 'productName', 'productSku'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(flattenedLogs);

    res.header('Content-Type', 'text/csv');
    res.attachment('logs.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting logs', error: error.message });
  }
};
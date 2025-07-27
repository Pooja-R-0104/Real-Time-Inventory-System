const { Op } = require('sequelize');
const Product = require('../models/product.model');
const InventoryMovement = require('../models/inventoryMovement.model');
const fs = require('fs');
const csv = require('csv-parser');
const sendEmail = require('../utils/sendEmail');

exports.createProduct = async (req, res) => {
  try {
    const { name, category, stock, threshold, sku, price, barcode, expiryDate } = req.body;
    const product = await Product.create({ name, category, stock, threshold, sku, price, barcode, expiryDate });
    await InventoryMovement.create({
        type: 'CREATE', quantityChange: stock, stockAfter: stock,
        productId: product.id, userId: req.user.id
    });
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Error: SKU must be unique.' });
    }
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

exports.deleteMultipleProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    if (!productIds || productIds.length === 0) {
      return res.status(400).json({ message: 'No product IDs provided.' });
    }
    const productsToDelete = await Product.findAll({
      where: { id: { [Op.in]: productIds } }
    });
    if (productsToDelete.length === 0) {
      return res.status(404).json({ message: 'No products found with the provided IDs.' });
    }
    const movements = productsToDelete.map(product => ({
      type: 'DELETE',
      quantityChange: -product.stock,
      stockAfter: 0,
      productId: product.id,
      userId: req.user.id,
    }));
    await InventoryMovement.bulkCreate(movements);
    await Product.destroy({
      where: { id: { [Op.in]: productIds } }
    });
    res.status(200).json({ message: `${productsToDelete.length} products deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting products', error: error.message });
  }
};

exports.bulkUploadProducts = async (req, res) => {
    if (!req.file) { return res.status(400).json({ message: 'No file uploaded.' }); }
    const results = [];
    const filePath = req.file.path;
    fs.createReadStream(filePath).pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const newProducts = await Product.bulkCreate(results);
                const movements = newProducts.map(product => ({
                    type: 'CREATE', quantityChange: product.stock, stockAfter: product.stock,
                    productId: product.id, userId: req.user.id
                }));
                await InventoryMovement.bulkCreate(movements);
                fs.unlinkSync(filePath); 
                res.status(201).json({ 
                    message: `${newProducts.length} products uploaded successfully.`,
                    products: newProducts 
                });
            } catch (error) {
                fs.unlinkSync(filePath);
                res.status(500).json({ message: 'Error processing CSV file.', error: error.message });
            }
        });
};

exports.getAllProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let whereClause = {};
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } }, { sku: { [Op.iLike]: `%${search}%` } },
                    { category: { [Op.iLike]: `%${search}%` } }, { barcode: { [Op.iLike]: `%${search}%` } }
                ]
            };
        }
        const products = await Product.findAll({ where: whereClause, order: [['createdAt', 'DESC']] });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) { return res.status(404).json({ message: 'Product not found' }); }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) { return res.status(404).json({ message: 'Product not found' }); }
    const oldStock = product.stock;
    await product.update(req.body);
    const newStock = product.stock;
    await InventoryMovement.create({
        type: 'UPDATE', quantityChange: newStock - oldStock, stockAfter: newStock,
        productId: product.id, userId: req.user.id
    });
    if (newStock <= product.threshold && oldStock > product.threshold) {
        try {
            await sendEmail({
                to: req.user.email, subject: `Low Stock Alert: ${product.name}`,
                html: `<h1>Low Stock Alert</h1><p>Product ${product.name} (SKU: ${product.sku}) stock is low: ${newStock} remaining.</p><p>Please reorder soon.</p>`
            });
        } catch (emailError) { console.error("Failed to send email alert:", emailError); }
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) { return res.status(404).json({ message: 'Product not found' }); }
    const oldStock = product.stock;
    await InventoryMovement.create({
        type: 'DELETE', quantityChange: -oldStock, stockAfter: 0,
        productId: product.id, userId: req.user.id
    });
    await product.destroy();
    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
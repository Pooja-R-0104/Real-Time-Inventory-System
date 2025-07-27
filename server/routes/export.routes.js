const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// All export routes are protected and for Admins only
router.use(protect, isAdmin);

router.get('/products', exportController.exportProducts);
router.get('/logs', exportController.exportLogs);

module.exports = router;
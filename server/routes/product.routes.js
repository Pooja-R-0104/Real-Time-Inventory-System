const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.use(protect);

router.post('/upload', isAdmin, upload.single('file'), productController.bulkUploadProducts);
router.post('/delete-multiple', isAdmin, productController.deleteMultipleProducts); // New route

router.post('/', isAdmin, productController.createProduct);
router.get('/', productController.getAllProducts);

router.route('/:id')
  .get(productController.getProductById)
  .put(isAdmin, productController.updateProduct)
  .delete(isAdmin, productController.deleteProduct);

module.exports = router;
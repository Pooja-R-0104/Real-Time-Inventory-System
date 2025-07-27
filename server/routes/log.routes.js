const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller');
const { protect } = require('../middleware/auth.middleware');

// All log routes are protected
router.use(protect);

router.get('/', logController.getLogs);

module.exports = router;
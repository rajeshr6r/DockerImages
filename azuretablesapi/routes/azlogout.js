const express = require('express');
const router = express.Router();
const azlogoutController = require('../controllers/azlogoutController');

router.get('/', azlogoutController.handleLogout);

module.exports = router;
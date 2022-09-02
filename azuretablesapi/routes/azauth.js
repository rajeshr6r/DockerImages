const express = require('express');
const router = express.Router();
const azauthController = require('../controllers/azauthController');

router.post('/', azauthController.handleLogin);

module.exports = router;
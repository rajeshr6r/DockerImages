const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/azrefreshTokenController');

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;
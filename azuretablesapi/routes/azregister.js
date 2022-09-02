const express = require('express');
const router = express.Router();
const azregisterController = require('../controllers/azregisterController');

router.post('/', azregisterController.handleNewUser);

module.exports = router;
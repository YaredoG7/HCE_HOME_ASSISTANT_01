const express = require('express');
const router = express.Router();

require('./device.route')(router);

module.exports = router;
const express = require('express');
const router = express.Router();

require('./index')(router),
module.exports = router;
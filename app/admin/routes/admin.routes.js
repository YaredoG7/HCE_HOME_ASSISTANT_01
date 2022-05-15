/****************************************************************
 * Bring together all the auth routes for admin access
 ****************************************************************/
 const express = require('express');
 const router = express.Router();
 
 require('./index.route')(router);

 module.exports = router;


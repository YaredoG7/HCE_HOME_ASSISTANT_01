/****************************************************************
 * Bring together all the auth routes for the app
 ****************************************************************/
 const express = require('express');
 const router = express.Router();
 
 require('./login.route')(router);
 require('./register.route')(router);
 require('./password.reset')(router);
 module.exports = router;
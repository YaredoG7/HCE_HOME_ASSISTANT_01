const password = require('../controller/password.reset.controller');

module.exports = function(router) {
    router.post('/get_access_code', password.resetPassPhone)
          .post('/reset_password', password.resetPasswordEmail)
          .post('/verify_password/:access_code', password.saveNewPassword);
}
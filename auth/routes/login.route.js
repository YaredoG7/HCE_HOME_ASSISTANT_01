const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports = function(router) {
    router.post("/login", function(req, res, next) {
      // console.log(req.body)
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields are required." });
      }
      passport.authenticate("local-login", function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          res.status(401).send({ code: 401, message: info.message });
          return;
        }
  
        req.logIn(user, function(err) {
          if (err) {
           // console.log(err)
            res.status(500).send({ code: 500, message: getErrorMessage(err) });
            return;
          }
          let secret = process.env.JWT_SECRET || "VTSECRET";
          const token = jwt.sign({ role: user.role }, secret);
          res.header("authorization", token);
          res.header("x-moged", user.hce_id);
         // console.log(err)
         user.password = null;
         user.salt = null;
         res
            .status(200)
            .send({ code: 200, message: 'success!', data: user, token: token });
          return;
        });
      })(req, res, next);
    });
  };
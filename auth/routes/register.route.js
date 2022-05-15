const passport = require("passport");
const User = require("mongoose").model("User");
const MogedEMail = require('../../utils/send.email');


module.exports = function(router) { 
    router.post("/register", function(req, res, next) {
      console.log(req.body)
        passport.authenticate("local-signup", function(err, user, info) {
          if (err) {
            return next(err);
          }
          if (user) {
            res.status(409).send({ message: info.message });
            return;            
          }
    
          let moged_user = new User(req.body.user);  
          console.log(moged_user);
          let user_id = "";
          switch (moged_user.role) {
            case "Admin": {
              user_id = "MOA"
              break;
          }
          case "User": {
              user_id = "MOU"
              break;
          }
          case "Staff" : {
              user_id = "MOS"
              break;
          }
          case "Owner": {
              user_id = "MOR"
              break;
          }
          case "Guest" : {
              user_id = "MOG"
              break;
          }
          default : {
              user_id = "MOX"
              break;
          }   
          }
          let possibleId = user_id + (Math.random() * 1000).toFixed();
          //  console.log(vit_user);
          User.setHceId(possibleId, null, function(generatedId) {
            moged_user.hce_id = generatedId;
            moged_user.save((err, user) => {
                if (err) {
                    res.status(500).send({code: 500, message: err.message});   
                    console.log(err);
                    return;
                }
                  else {
                  let mail = {
                    to: user.email,
                    subject: 'Moged Car Rental Solutions Notification',
                    head: 'Welcome!!  &#127881 &#127881',
                    title: 'Happy to ride with you &#128525; !! ', 
                    content: `An account has been created for you, you can use <b>${user.email}</b> to start using Moged`,
                    action: 'download mobile app',
                    extra: ''
                  }

                  // send password 
                  let sms = {
                      to: user.phone,
                      message: 'Welcome! Your Moged account has been created. We are happy to ride with you :) Moged Car Rental Solutions'
                  }

                  MogedEMail(mail);
                  // successfully saved
                  res.status(201).json(user);
                  return;
                  }
            })
          })
        })(req, res, next);
      });
}


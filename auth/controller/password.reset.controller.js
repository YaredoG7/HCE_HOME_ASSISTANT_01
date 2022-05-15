const User = require("mongoose").model("User");
const async = require("async");

const MogedMail = require('../../utils/send.email');
const sms = require('../../utils/send.sms');



/************************************
 * Reset password users phone
 *************************************/

exports.resetPassPhone = (req, res, next) => {
  async.waterfall(
    [
      function(done) {
        let token = Math.floor(Math.random() * 1000000);
        done(null, token);
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            res.status(404).send({code: 404, message: "No user found with this email address" });
            return;
          }
          user.accessToken = token;
          user.tokenExpiry = Date.now() + 18000000;
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      async function(token, user, done) {
        let message = {
          to: processPhone(user.phone),
          body: `You have requested password reset for your Portal VT account. Enter the following code: ${token}`
        };

        let email = {
          to: user.email,
          code: token,
          subject: 'Your Portal VT Account'
        };
        if ((user && user.phone !== undefined) || user.phone != null) {
           await sms(message);
           await MogedMail(email);
          res.status(200).json({ code: 200, message: "Message has been sent" });
        } else {
          res
            .status(500)
            .json({ error: "Something went while sending the email" });
        }
        next();
      }
    ],
    function(err) {
      if (err) return next(err);
      // res.status(200).json({message: 'OK'});
    }
  );
}


function processPhone(num) {
  if(num.startsWith("06")) {
    console.log(num.replace("06", "+36"))
    return num.replace("06", "+36");
  } else if (num.startsWith("07")) {
    return num.replace("07", "+44");
  } else if (num.startsWith("44")) {
    return num.replace("44", "+44");
  }
}

/************************************
 * Reset password users email
 *************************************/

exports.resetPasswordEmail = (req, res, next) => {
    async.waterfall(
      [
        function(done) {
          let token = Math.floor(Math.random() * 1000000);
          done(null, token);
        },
        function(token, done) {
          User.findOne({ email: req.body.email }, (err, user) => {
            if (!user) {
              res.json({
                code: 404,
                message: "No user found with this email address"
              });
              return;
            }
            user.accessToken = token;
            user.tokenExpiry = Date.now() + 18000000;
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
            let mail = {
                to: user.email,
                subject: 'ViTelecom Portal Notification',
                text: '',
                code: token
            }
  
          let success = HahuMail(mail);
  
          if (success)
            res.status(200).json({ code: 200, message: "Email has been sent" });
          else
            res
              .status(500)
              .json({ error: "Something went while sending the email" });
          done("done");
        }
      ],
      function(err) {
        if (err) return next(err);
        
      }
    );
  };


  /**************************
 * Save new password token
 **************************/

exports.saveNewPassword = (req, res, next) => {
    async.waterfall(
      [
        function(done) {
          User.findOne(
            {
              accessToken: req.params.access_code,
              tokenExpiry: { $gt: Date.now() }
            },
            function(err, user) {
              if (err) {
                return next(err);
              }
              if (!user) {
                res.json({
                  code: 404,
                  message: "Something went wrong, unable to save new password"
                });
              }
              user.password = req.body.password; // new password
              user.accessToken = undefined;
              user.tokenExpiry = undefined;
  
              user.save(function(err) {
                done(err, user);
              });
            }
          );
        },
        function(user, done) {
          let mail = {
            to: user.email,
            subject: "ViTelecom Portal Notification",
            text: '',
            head:'This email is to notify you that you have successfully updated your password',
            body: 'If you were not the one who has made the changes please contact us as soon as possible',
            footer: 'Best wishes from ViTelecom!'

          };
  
          let success = HahuMail(mail);;
  
          if (success) {
            res.status(201).json({ code: 201, message: "Email has been sent" });
          } else {
            res
              .status(500)
              .json({ error: "Something went while sending the email" });
          }
          done("done");
        }
      ],
      function(err) {
        if (err) return next(err);
        //  res.send("Redirecting...");
      }
    );
  };


  
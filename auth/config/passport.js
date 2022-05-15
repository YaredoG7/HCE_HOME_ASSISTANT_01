const LocalStrategy = require("passport-local").Strategy;
const User = require('mongoose').model('User');
module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser( function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
    },  
    function ( username, password, done ) {

        process.nextTick(function() {

            User.findOne({email: username}, function (err, user) {
                if (err) { return done(err)}

                if (user){
                    // console.log('I have found a user in here.. ')
                    return done(null, false, {message: 'Email already taken.'})
                } 
                return done(null, user);
            })
        })
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',

    },  (username , password, done) => {
        
        User.findOne({email: username},  (err, user) => {
            if (err) { return done(err)}
            if (!user){
                return done(null, false, {
                    message: "Incorrect credentials provided email or password not correct."
                })
            }
            if (!user.isValidPassword(password)) {
                return done(null, false, {
                    message: "Incorrect credentials provided password or email not correct."
                });
            }
       
            user.password = null;
            user.salt = null;
            return done(null, user);
        });
        
    }))

   
}
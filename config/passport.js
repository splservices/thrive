
var FacebookStrategy = require('passport-facebook').Strategy;
const fbConfig = require('./constant').facebook;

// load up the user model
const User  = require('../models/user.model');


module.exports = function(passport){
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: fbConfig.app_id,
        clientSecret: fbConfig.app_secret,
        callbackURL: fbConfig.url
    }, function(token, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'facebook_id':profile.id}, function(err, user){
                if(err) return done(err);
                if(user){
                    return done(null, user)
                }else{
                    var newUser = new User();
                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    newUser.save(function(err){
                        if(err) throw err;
                        return done(null, newUser)
                    })
                }
            })
        })
    }))
};

var FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./constant');
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;

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

    passport.use(new LocalStrategy(
        function(username, password, done) {

            User.findOne({email:username}, (err, user)=>{
            console.log(`username ${username}`)
                if(err) return done(err);
                if(user){
                    let checkPassword = bcrypt.compareSync(password, user.hashed_password);

                    if(checkPassword){
                        console.log(`password success`)
                        //let token  = jwt.sign({email:email}, secret, {expiresIn:'24h'});
                        return done(null, user)
                    }else{
                        console.log(`password failed`)
                        return done({success:false}, false)
                    }
                }else{
                    console.log(`auth failed`)
                    done(null, false)
                }
            });
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: config.google.app_id,
            clientSecret: config.google.app_secret,
            callbackURL: config.google.url
        },
        function(accessToken, refreshToken, profile, cb) {

            User.findOne({ googleId: profile.id }, function (err, user) {
                if(user){
                    return cb(err, user);
                }else{
                    let newUser = new User({
                        name:profile._json.name,
                        username:profile._json.email,
                        email:profile._json.email
                    });

                    newUser.save((err)=>{
                        if(err) throw err;
                        return cb(err, newUser);
                    })
                }

            });
        }
    ));

    passport.use(new FacebookStrategy({
        clientID: config.facebook.app_id,
        clientSecret: config.facebook.app_secret,
        callbackURL: config.facebook.url
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
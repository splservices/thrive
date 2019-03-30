const express = require('express');
const router = express.Router();
const loginValidation = require('../../validations/api.validation');
const {loginUser, registerUser} = require('../../controllers/user.controller');
const  { celebrate, Joi }  = require('celebrate');
const passport = require('passport');


router.get('/facebook', passport.authenticate('facebook', {scop:['email','public_profile']}));

router.get('/facebook/callback', passport.authenticate('facebook',{
    successRedirect:'/feed',
    failureRedirect:'/login'
}));

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/feed');
    });

router.get('/authToken/:email', (req, res)=>{
    const email = req.params.email;
    res.send({email:email})
});

// celebrate(loginValidation.loginDetail),

router.post('/login', loginUser);
router.post('/register', registerUser);

router.post('/test', celebrate(loginValidation.loginDetail), (req, res) => {});

module.exports = router;
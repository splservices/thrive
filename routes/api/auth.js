const express = require('express');
const router = express.Router();
const loginValidation = require('../../validations/api.validation');
const {loginUser, registerUser} = require('../../controllers/user.controller');
const  { celebrate, Joi }  = require('celebrate');
const passport = require('passport');


router.post('/facebook', passport.authenticate('facebook', {scop:['email','public_profile']}));

router.get('/facebook/callback', passport.authenticate('facebook',{
    successRedirect:'/feed',
    failureRedirect:'/login'
}));

router.post('/login', celebrate(loginValidation.loginDetail),loginUser);
router.post('/register', celebrate(loginValidation.registerDetail), registerUser);

router.post('/test', celebrate(loginValidation.loginDetail), (req, res) => {});

module.exports = router;
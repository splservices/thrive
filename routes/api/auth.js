const express = require('express');
const router = express.Router();
const loginValidation = require('../../validations/api.validation');
const {loginUser, registerUser} = require('../../controllers/user.controller');
const  { celebrate, Joi }  = require('celebrate');

router.post('/login', celebrate(loginValidation.loginDetail), loginUser);
router.post('/register', registerUser);

module.exports = router;
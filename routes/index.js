const express = require('express');
const router = express.Router();
const secret = require('../config/constant').jwt_secret;
const jwt = require('jsonwebtoken');

router.use('/auth', require('./api/auth'))

module.exports = router;
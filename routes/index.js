const express = require('express');
const router = express.Router();
const { checkToken } = require("../controllers/auth.controller");

router.use('/auth', require('./api/auth'));
router.use('/post', checkToken, require('./api/post'));
router.use('/user', checkToken, require('./api/user'))

module.exports = router;
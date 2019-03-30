const express = require('express');
const router = express.Router();
const { checkToken } = require("../controllers/user.controller");

router.use('/auth', require('./api/auth'));
router.use('/post', checkToken, require('./api/post'));

module.exports = router;
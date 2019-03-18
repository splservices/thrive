const express = require('express');
const router = express.Router();
const secret = require('../config/constant').jwt_secret;
const jwt = require('jsonwebtoken');





router.get('/', (req, res)=>{
    res.json({
        success:true
    })
});


router.use('/api/auth', require('./api/auth'))

module.exports = router;
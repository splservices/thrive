const express = require('express');
const router = express.Router();
const { singleUser, followUser } = require('../../controllers/user.controller');

router.get('/:userId', singleUser);
router.post('/:userId/follow', followUser)


module.exports = router;
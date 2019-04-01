const express = require('express');
const router = express.Router();
const { singleUser, followUser, unfollowUser } = require('../../controllers/user.controller');

router.get('/:userId', singleUser);
router.post('/:userId/follow', followUser);
router.post('/:userId/unfollow', unfollowUser);


module.exports = router;
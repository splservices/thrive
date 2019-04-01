const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, deletePost } = require('../../controllers/post.controller');

router.post('/', createPost);
router.get('/', getAllPosts);
router.delete('/:postId', deletePost)
module.exports = router;
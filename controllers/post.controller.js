const mongoose = require('mongoose');
const Post = require('../models/post.model');

const createPost = (req, res)=>{
    let newPost = new Post(req.body);
    newPost.creator = req.user._id;
    newPost.save((err)=>{
        if(err) throw err;
        res.json({
            success:true,
            data:newPost
        })
    })
};

const getAllPosts = (req, res)=>{
    let user = req.user;
    let criteria = {
        creator: {$in:user.following.concat(user._id)}
    };
    Post.find(criteria, null, {sort:{created:-1}})
        .populate('creator')
        .exec(function(err, posts){
            res.json({
                success:true,
                data:posts
            })
        })

};

module.exports = {createPost,getAllPosts};


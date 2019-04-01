const mongoose = require('mongoose');
const Post = require('../models/post.model');

const createPost = (req, res)=>{
    let newPost = new Post(req.body);
    newPost.creator = req.user;

    newPost.save(err=>{
        res.json({
            success:true,
            data:newPost
        })
    })

};

const getAllPosts = (req, res)=>{
    let user = req.user;
    console.log(user)
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

const deletePost = (req, res)=>{
    Post.remove({_id:''}, (err, post)=>{
        if(err) throw err;
        res.json({
            success:true,
            message:'Successfully Deleted'
        })
    })
};

module.exports = {createPost,getAllPosts, deletePost};


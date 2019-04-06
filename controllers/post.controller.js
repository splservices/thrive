const mongoose = require('mongoose');
const Busboy = require('busboy')
const Post = require('../models/post.model');



const createPost = (req, res)=>{
    let newPost = new Post(req.body);
    newPost.creator = req.user;

    newPost.save(err=>{
        Post.findOne({_id:newPost.id})
            .populate('creator')
            .populate({
                path:'attachments',
                populate:{path:'attachments'}
            })
            .exec(function(err, post){
                res.json({
                    success:true,
                    data:post
                })
            })

    })
};

const uploadMedia = (req,res)=>{

    res.send({
        success:true,
        message: 'Uploaded Successfully'
    })
};

const getAllPosts = (req, res)=>{
    let user = req.user;
    console.log(user)
    let criteria = {
        creator: {$in:user.following.concat(user._id)}
    };
    Post.find(criteria, null, {sort:{created:-1}})
        .populate({
            path:'attachments',
            populate:{path:'attachments'}
        })
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

module.exports = {createPost,getAllPosts, deletePost, uploadMedia};


const mongoose = require('mongoose');
const Busboy = require('busboy')
const Post = require('../models/post.model');
const _ = require('lodash');



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
            let modifiedPosts = _.map(posts, (post)=>{
                post.likedByMe = post.likes.indexOf(user._id) !== -1;
               return post
            });

            res.json({
                success:true,
                data:modifiedPosts
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

const likePost = (req,res)=>{
    const {postId} = req.params;
    console.log(postId);
    Post.findOne({_id:postId})
        .populate('creator')
        .exec((err, post)=>{
            if(err) return res.send({success:false, message:err});
            if(post.likes.indexOf(req.user._id) !== -1){
                return res.send({success:false, message:'user has already liked this post'})
            }
            post.likes.push(req.user._id);
            post.save((err, item)=>{
                post = post.afterSave(req.user)
                if(err) return res.send({success:false, message:err});
                return res.send({success:true,data:item})
            })
        })
};

const unlikePost = (req,res)=>{
    const {postId} = req.params;
    console.log(postId);
    Post.findOne({_id:postId})
        .populate('creator')
        .exec((err, post)=>{
            if(err) return res.send({success:false, message:err});
            if(post.likes.indexOf(req.user._id) !== -1){
                post.likes.splice(post.likes.indexOf(req.user._id), 1);
                post.save((err, item)=>{
                    post = post.afterSave(req.user)
                    if(err) return res.send({success:false, message:err});
                    return res.send({success:true,data:item})
                })
            }else{
                return res.send({
                    success:false,
                    message:'You have not liked the post yet'
                })
            }


        })
};

const postLikes = (req, res)=>{
    const {postId} = req.params;
    Post.findOne({_id:postId})
        .populate('likes')
        .exec((err, post)=>{
            return res.send({
                success:true,
                data:post.likes
            })
        })
};

module.exports = {createPost,getAllPosts, deletePost, uploadMedia, likePost, unlikePost,postLikes};


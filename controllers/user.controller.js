const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const secret = require('../config/constant').jwt_secret;
const User = require('../models/user.model');
const { avatarUpload } = require('../multer.service');

const singleUser = (req, res)=>{
    let criteria = {};
    criteria.username = req.params.userId;

    User.findOne(criteria)
        .populate('following')
        .exec((err, user)=>{
            if(err) throw err;
            if(user){
                //Get the Followers
                User.find({following:user._id}, (err, followers)=>{
                    if(err) throw err;
                    return res.json({
                        data:user,
                        followers:followers,
                        following:user.following,
                        self:(req.user.username === criteria.username),
                        alreadyFollowing:!!_.size(req.user.following.filter((item) => item.username === user.username))
                    })
                })
            }else{
                return res.json({
                    success:false,
                    message:'User not Found'
                })
            }
        })
};

const uploadAvatar = (req, res, next)=>{
    const {userId }= req.params;
    console.log(`uploading avatar ${userId}`)
    avatarUpload(req, res, function(err){
        if(err) return res.send({err:err});

        User.findOneAndUpdate({username:userId}, {$set:{face:req.file.location}},{new:true},(err, user)=>{
            return res.send({
                success:true,
                data:user
            })
        })

        //
        // let media = new Media({url:req.file.location});
        // media.save((err)=>{
        //     if(err) return res.send({err:err});
        //     return res.send({
        //         success:true,
        //         data:media
        //     })
        // });

    })
};

const followUser = (req,res)=>{
    let currentUser = req.user;
    let toFollow = req.param('userId');

    let already = currentUser.following.filter(function(item) {
        return item.username === toFollow;
    }).length;
    if (already) {
        return res.json({
            success:false,
            message:'You are already following'
        })
    }

    User.findOne({username:toFollow}, (err, user)=>{
        currentUser.following.push(user._id);
        currentUser.save((err, item)=>{
            res.json({
                data:item
            })
        })
    })
};

const unfollowUser = (req, res)=>{
    let currentUser = req.user;
    let toUnfollow = req.param('userId');

    let already = currentUser.following.filter(function(item) {
        return item.username === toUnfollow;
    }).length;
    if (!already) {
        return res.json({
            success:false,
            message:'You are already not following'
        })
    }

    User.findOne({username:toUnfollow}, (err, user)=>{
        if(err) throw err;
        currentUser.following.splice(currentUser.following.indexOf(user._id), 1);
        currentUser.save((err, item)=>{
            if(err) throw err;
            res.json({
                data:item
            })
        })
    })
};


module.exports = { singleUser,uploadAvatar, followUser, unfollowUser };
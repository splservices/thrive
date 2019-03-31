const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const secret = require('../config/constant').jwt_secret;
const User = require('../models/user.model');

const singleUser = (req, res)=>{
    let criteria = {};
    criteria.username = req.params.userId;

    User.findOne(criteria)
        // .populate('following')
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
                        alreadyFollowing:_.size(req.user.following.filter((item)=>item.username ===user.username))?true:false
                    })
                })
            }
        })
};

const followUser = (req,res)=>{
    let currentUser = req.user;
    console.log(`current user`);
    console.log(currentUser)
    let toFollow = req.param('userId');
    User.findOne({username:toFollow}, (err, user)=>{
        currentUser.following.push(user._id);
        currentUser.save((err, item)=>{
            res.json({
                data:item
            })
        })

    })
};


module.exports = { singleUser, followUser };
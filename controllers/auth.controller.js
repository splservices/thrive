const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/constant').jwt_secret;
const User = require('../models/user.model');
const { sendMail } = require('./mailer.controller');

const checkToken = (req, res, next)=>{
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(token && token.startsWith('Bearer ')){
        token = token.slice(7, token.length)
    }
    if(token){
        jwt.verify(token, secret, (err, decoded)=>{
            if(err){
                return res.status(403).json({
                    success:false,
                    message:'Unauthorized'
                })
            }else{
                req.decoded = decoded;
                User.findOne({email:decoded.email})
                    .populate('following')
                    .exec((err, user)=>{
                        if(err) throw err;
                        if(user){
                            req.user = user;
                            next();
                        }
                    });
            }
        })
    }else{
        return res.status(403).json({
            success:false,
            message:'Unauthorized'
        })
    }
};

const loginUser = (req, res)=>{
    const email = req.body.email.toLowerCase();
    const {password} = req.body

    User.findOne({email:email}, (err, user)=>{
        if(err) throw err;
        if(user){
            let hashed_password = user.hashed_password || null;
            if(!hashed_password) return res.json({message:'eeror'})
            let checkPassword = bcrypt.compareSync(password, user.hashed_password);
            if(checkPassword){

                let token  = jwt.sign({email:email}, secret, {expiresIn:'24h'});
                req.user = user;
                res.json({
                    success:true,
                    message:'Login Successfully',
                    token:token,
                    data:user
                })
            }else{
                res.json({
                    success:false,
                    message:'Incorrect Password'
                })
            }
        }else{
            res.json({
                success:false,
                message:'Email Address is not registered'
            })
        }
    });

};
const registerUser = (req, res)=>{

    const name = req.body.name.toLowerCase();
    const username = req.body.username.toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    let newUser = new User({name, username, email, password});

    User.findOne({email:email}, (err, userWithEmail)=>{
        if(err) throw err;
        if(userWithEmail){
            res.json({
                success:false,
                message:'Email is already Registered.'
            })
        }else{
            User.findOne({username:username},(err, userWithUsername)=>{
                if(err) throw err;
                if(userWithUsername){
                    res.json({
                        success:false,
                        message:'Username is already taken'
                    })
                }else{
                    newUser.save(function(err){
                        if(err) throw err;
                        sendMail(newUser);
                        res.json({
                            success:true,
                            message:'User Created Successfully'
                        })
                    })
                }
            })
        }
    });
};



module.exports = { loginUser, registerUser, checkToken };
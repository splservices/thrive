const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = require('../../models/user.model');

const checkToken = (req, res, next)=>{
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(token && token.startsWith('Bearer ')){
        token = token.slice(7, token.length)
    }
    if(token){
        jwt.verify(token, secret, (err, decoded)=>{
            if(err){
                return res.json({
                    success:false,
                    message:'Token is not valid'
                })
            }else{
                req.decoded = decoded;
                next();
            }
        })
    }else{
        return res.json({
            success:false,
            message:'Auth token is not supplied'
        })
    }
};

const loginUser = (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;

    let mockedUsername = 'admin';
    let mockedPassword = '123';

    if(username && password){
        if(username === mockedUsername && password === mockedPassword){
            let token  = jwt.sign({username:username}, secret, {expiresIn:'24h'});
            res.json({
                success:true,
                message:'Authentication Successful',
                token:token
            })
        }else{
            res.json({
                success:false,
                message:'Incorrect Username or Password'
            })
        }
    }else{
        res.json({
            success:false,
            message:'Authentication failed!'
        })
    }
};
const registerUser = (req, res)=>{

    let newUser = new User(req.body);
    //console.log(user);
    // res.json(user);
    User.findOne({email:req.body.email}, (err, userWithEmail)=>{
        if(err) throw err;
        if(userWithEmail){
            res.json({
                success:false,
                message:'Email is already Registered.'
            })
        }else{
            User.findOne({username:req.body.username},(err, userWithUsername)=>{
                if(err) throw err;
                if(userWithUsername){
                    res.json({
                        success:false,
                        message:'Username is already taken'
                    })
                }else{
                    newUser.save(function(err){
                        if(err) throw err;
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


router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;
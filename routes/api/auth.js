const express = require('express');
const router = express.Router();

const checkToken = (req, res, next)=>{
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(token && token.startsWith('Bearer ')){
        token = token.slice(7, token.length)
    };
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
const registerUser = ()=>{};

router.post('/login', loginUser);
router.post('/register', registerUser);
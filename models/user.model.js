'use strict'
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
    created:{
        type:Date,
        default:Date.now
    },
    name: {
        type: String,
        required: true
    },
    username:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
    },
    hashed_password: {
        type: String,
        required: true
    },
    following:[ {
        type: Schema.ObjectId,
        required:true,
        ref:'User'
    }],
    socketId:{
        type:String,
        default:false
    },
    onlineStatus:{
        type:Boolean,
        default:false
    },
    loggedIn: {
        type:Boolean,
        default:false
    },
    googleId:{
      type:String,
        default:''
    },
    notification:[{
        post: {type:Schema.ObjectId, ref:'Post'},
        user: {type:Schema.ObjectId, ref:'User'},
        created: {type:Date,  default:Date.now},
        notificationType: String,
        unread: {type: Boolean, default: true}
    }],
    token:String,
    resetPasswordToken:String,
    resetPasswordExpires: Date,
    activationCode: String,
    active:{
        type:Boolean,
        default:false
    }
},

{
    toObject: {
        virtuals: true
    }
,
    toJSON: {
        virtuals: true
    }
});

UserSchema.virtual('password')
    .set(function(password){
        this._password = password;
        this.hashed_password = this.hashPassword(password)
    })
    .get(function(){
    return this._password;
});


//Methods
UserSchema.methods = {
    hashPassword: function(password){
        let hashed_password = bcrypt.hashSync(password, 8);
        return hashed_password;
    },
    toJSON:function(){
        let obj = this.toObject();
        obj.onlineStatus = obj.socketId?true:false;
        delete obj.socketId;
        delete obj.hashed_password;
        delete obj.notifications;
        delete obj.salt;
        delete obj.token;
        delete obj.following;
        return obj;
    }
};

 const User = mongoose.model("users", UserSchema);
 module.exports = User;
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
    face:{
      type:String,
      default:'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwimz9375KrhAhUPUI8KHWXDAAAQjRx6BAgBEAU&url=http%3A%2F%2Fnisatas.j-plus.co%2Fdefault-avatar-png%2F&psig=AOvVaw1lIOGqWCIfVnzZ4YPQQyp0&ust=1554066840356051'
    },
    hashed_password: {
        type: String,
    },
    following:[ {
        type: Schema.Types.ObjectId,
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

 const User = mongoose.model("User", UserSchema);
 module.exports = User;
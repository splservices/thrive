const mongoose = require("mongoose");
const bycrypt = require("bycryptjs");
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
        required:true,
        unique:true
    },
    email: {
        type: String,
        required: true
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
});

UserSchema.methods = {
    hashPassword: (password)=>{
        let salt = bcyrypt.getSaltSync(10);
        let hashed_password = bycrypt.hashSync(password, salt);
        return hashed_password;
    },
    toJSON:()=>{
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

module.exports = User = mongoose.model("users", UserSchema);
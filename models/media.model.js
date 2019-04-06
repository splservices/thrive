'use strict'
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
    created:{
        type:Date,
        default:Date.now()
    },
    url:{
        type:String,
        required:true
    }
});

const Media = mongoose.model("Media", MediaSchema);
module.exports = Media;
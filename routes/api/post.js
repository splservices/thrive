const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const randomstring = require("randomstring");
const { createPost, getAllPosts, uploadMedia, deletePost } = require('../../controllers/post.controller');
const Media = require('../../models/media.model');


const s3 = new aws.S3({ /* ... */ })

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'volupn',
        acl:'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            console.log(file)
            cb(null, randomstring.generate()+file.originalname)
        }
    })
});

const singleUpload = upload.single('postImage');

const uploadMiddleware = (req, res, next)=>{

    singleUpload(req, res, function(err){
        if(err) return res.send({err:err});
        let media = new Media({url:req.file.location});
        media.save((err)=>{
            if(err) return res.send({err:err});
            return res.send({
                success:true,
                data:media
            })
        });

    })
};

router.post('/', createPost);
router.post('/media', uploadMiddleware);
router.get('/', getAllPosts);
router.delete('/:postId', deletePost);
module.exports = router;
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const randomstring = require("randomstring");



const s3 = new aws.S3({ /* ... */ });

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

const avatarUpload = upload.single('avatar');


module.exports = {avatarUpload};
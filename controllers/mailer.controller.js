const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'pradeep98208@gmail.com',
        pass:'844187536'
    }
});

const generate = (options, cb)=>{
    const templatePath = path.join(__dirname, '../public/notification.html');

    fs.readFile(templatePath, (err, fileContent)=>{
        let html = ejs.render(fileContent.toString(), options);
        return cb(html)
    });

};

const sendMail = (user)=>{

    generate({
        name:user.name,
        message:'Welcome! In order to continue using the platform, you will need to activate your account by clicking the below link:',
        action:'Activate My account',
        subject:'Activate Your Account',
        href:'https://www.volupn.com'
    }, (html)=>{
        console.log(`generating html`)
        let data = {actor:{name:'Activation'}};
        data.html = html;
        let mailOptions = {
            from: data.actor.name + ' (' + 'Account Created' + ')' + ' via ' + 'Work' + ' <'+ 'pradeep98208@gmail.com' +'>', // sender address
            to: user.email, // list of receivers
            subject: 'Notification', // Subject line
            html: data.html
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    })

};


module.exports = { sendMail }
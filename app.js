

const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const boom = require('express-boom');
const session = require('express-session');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser')
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

//const { errors } = require('celebrate');
const passport = require('passport');


const index = require('./routes/index');


var mailOptions = {
    from: 'pradeep98208@gmail.com',
    to: 'pk9654048874@gmail.com',
    subject: 'Sending Email using Node.js',
    html: '<h1>That was easy!</h1>'
};



const app = express();

app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({limit:'1mb',extended:true}));
app.use(cookieParser());
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:['sdfgsdfg']
}));
// app.use(session({name:'thrive', secret:'thrive'}));
app.use(helmet());
app.use(boom());
app.use(cors());

// app.use(busboy());
// app.use(busboyBodyParser());

require('./config/passport')(passport); // pass passport for configuration

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('build'));



app.use('/api', index);
app.use('*',(req, res, next)=>{
    var output = fs.readFileSync(__dirname + '/build/index.html');
    res.type('html').send(output);
    //next();

});



//app.use(errors());


module.exports = { app };

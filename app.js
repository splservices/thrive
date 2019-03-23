

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const boom = require('express-boom');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { errors } = require('celebrate');
const passport = require('passport');

const index = require('./routes/index');


const app = express();

app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({limit:'1mb',extended:true}));
app.use(cookieParser());
// app.use(session({name:'thrive', secret:'thrive'}));
app.use(helmet());
app.use(boom());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('build'));



app.use('/api', index);
app.use('*',(req, res, next)=>{
    var output = fs.readFileSync(__dirname + '/build/index.html');
    res.type('html').send(output);
    //next();

});



app.use(errors());


module.exports = { app };

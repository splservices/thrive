

const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const boom = require('express-boom');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
//const { errors } = require('celebrate');
const passport = require('passport');

const index = require('./routes/index');


const app = express();

// app.use(bodyParser.json({limit:'1mb'}));
// app.use(bodyParser.urlencoded({limit:'1mb',extended:true}));
// app.use(cookieParser());
// app.use(helmet());
// app.use(boom());
// app.use(cors());

console.log('app is working fine')


//app.use(errors());


module.exports = { app };

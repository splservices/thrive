const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const boom = require('express-boom');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors')

const index = require('./routes/index');


const app = express();

app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({limit:'1mb',extended:true}));
app.use(cookieParser());
// app.use(session({name:'thrive', secret:'thrive'}));
app.use(helmet());
app.use(boom());
app.use(cors());

app.use('/', index);

module.exports = { app }

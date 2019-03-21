import {Process as process} from "node/globals";

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const boom = require('express-boom');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { errors } = require('celebrate')

const index = require('./routes/index');


const app = express();

app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({limit:'1mb',extended:true}));
app.use(cookieParser());
// app.use(session({name:'thrive', secret:'thrive'}));
app.use(helmet());
app.use(boom());
app.use(cors());



app.use(express.static('build'));
app.use((req, res, next)=>{
    if(req.method === 'POST'){
        var dataUpper = {};
        req.on('data', function(chunk) {
            console.log(chunk)
            var dataString = chunk.toString();
            dataUpper = dataString.toUpperCase();
            log.info({"received body data": dataUpper });
        });

        req.on('end', function() {
            res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
            res.end(dataUpper);
        });
        next();
    }

});


app.use('/api', index);
app.use('*',(req, res, next)=>{
    var output = fs.readFileSync(__dirname + '/build/index.html');
    res.type('html').send(output);
    //next();

});

const numeral = require('numeral');
setInterval(()=>{
    const {rss, heapTotal }  = process.memoryUsage();
    console.log(`rss`, numeral(rss).format(`0.0 ib`), `heapTotal`, numeral(heapTotal).format(`0.0ib`))
},5000);

app.use(errors());


module.exports = { app };

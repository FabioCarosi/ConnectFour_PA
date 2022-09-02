var express = require('express');


const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

//It parses incoming requests with JSON payloads and is based on body-parser.
//app.use(express.json());
var myLogger = function (req, res, next) {
    console.log('LOGGED');
    next();
  };

app.use(myLogger);

app.get('/', (req,res)=>{
    res.send("Hello");
});

app.get('/test', (req,res)=>{
    res.send("Hello Fabio");
});


app.listen(PORT,HOST);
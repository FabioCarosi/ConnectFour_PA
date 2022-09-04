
var express = require('express');
import * as controller from "./controllerProva/prova";

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

//It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
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

//This root allows to start a new game if it's possible
//aggiungi middleware di validation per iniziare la partita (utenti esistenti, partita già esistente, ...)

app.post('/startGame', (req, res) =>{
    controller.startGame(req,res);
});


//This root allows to make a move in the corrisponding game

app.post('/makeMove', (req, res) => {
    controller.makeMove(req, res);
})

app.listen(PORT,HOST);
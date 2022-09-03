"use strict";
exports.__esModule = true;
var express = require('express');
var controller = require("./controllerProva/prova");
var PORT = 8080;
var HOST = '0.0.0.0';
var app = express();
//It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
var myLogger = function (req, res, next) {
    console.log('LOGGED');
    next();
};
app.use(myLogger);
app.get('/', function (req, res) {
    res.send("Hello");
});
app.get('/test', function (req, res) {
    res.send("Hello Fabio");
});
app.post('/startGame', function (req, res) {
    controller.startGame(req, res);
});
app.listen(PORT, HOST);

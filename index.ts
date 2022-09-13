var express = require("express");
import * as controller from "./controller/controller";
import * as chain from "./middleware/chain";
var download = require("downloadjs");

const PORT = 8080;
const HOST = "0.0.0.0";

const app = express();

//It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
var myLogger = function (req, res, next) {
  console.log("LOGGED");
  next();
};

app.use(myLogger);
app.use(chain.JwtValidation);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/test", (req, res) => {
  res.send("Hello Fabio");
});

//This root allows to start a new game
app.post("/startGame", chain.gameValidation, (req, res) => {
  controller.startGame(req, res);
});

//This root allows to make a move in the corrisponding game
app.post("/makeMove", chain.moveValidation, (req, res) => {
  controller.makeMove(req, res);
});

//This root allows to make request for leave a game 
app.post("/leaveGame", chain.leaveValidation, (req, res) => {
  controller.leaveGame(req, res);
});

//This root allows to view the state of a game 
app.post("/stateGame", chain.stateValidation, (req, res) => {
  controller.stateGame(req, res);
});

//This root allows the admin to charge user's credit
app.post("/chargeCredit", chain.chargeValidation, (req, res) => {
  controller.chargeCredit(req, res);
});

//This root allows to view all games played by a user
app.get("/viewGamesByUser", chain.viewValidation, (req, res) => {
  controller.viewGamesByUser(req, res);
});

//This root allows to download the list of moves in csv or json format
app.post("/allMoves", chain.listValidation, (req, res) => {
  controller.getMovesList(req, res).then( () => {
    let path = "/usr/src/app/moves." + req.body.format;
    res.download(path); 
  })
  
 });

app.listen(PORT, HOST);

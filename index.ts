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

//This root allows to start a new game if it's possible
//aggiungi middleware di validation per iniziare la partita (utenti esistenti, partita già esistente, ...)

app.post("/startGame", chain.gameValidation, (req, res) => {
  controller.startGame(req, res);
});

//This root allows to make a move in the corrisponding game

app.post("/makeMove", chain.moveValidation, (req, res) => {
  controller.makeMove(req, res);
});

app.post("/leaveGame", chain.leaveValidation, (req, res) => {
  controller.leaveGame(req, res);
});

//rotta per l’utente con ruolo admin che consenta di effettuare la ricarica per un utente
//fornendo la mail ed il nuovo “credito” (sempre mediante JWT). I token JWT devono contenere i dati essenziali.
//app.get('/chargeCredit',);

app.post("/stateGame", chain.stateValidation, (req, res) => {
  controller.stateGame(req, res);
});

//Questa rotta permette all'admin di aggiornare il credito di un utente
app.post("/chargeCredit", chain.chargeValidation, (req, res) => {
  controller.chargeCredit(req, res);
});

//Questa rotta permette di visualizzare le partite svolte da un dato utente
app.get("/viewGamesByUser", chain.viewValidation, (req, res) => {
  controller.viewGamesByUser(req, res);
});

app.post("/allMoves", chain.listValidation, (req, res) => {
  controller.getMovesList(req, res).then( () => {
    let path = "/usr/src/app/moves." + req.body.format;
    res.download(path); 
  })
  
 });

app.listen(PORT, HOST);


import * as GameClass from '../models/game';
import * as UserClass from '../models/user';
const jwt = require('jsonwebtoken');

export var requestTime = function (req, res, next) {
    req.requestTime = Date.now();
    next();
  };

export var checkHeader = function(req, res, next){
    const authHeader = req.headers.authorization;
    if (authHeader) {
        next();
    }else{
        next("no auth header");
    }
};


export function checkToken(req,res,next){
  const bearerHeader = req.headers.authorization;
  if(typeof bearerHeader!=='undefined'){
      const bearerToken = bearerHeader.split(' ')[1];
      req.token=bearerToken;
      next();
  }else{
      res.sendStatus(403);
  }
}

export function verifyAndAuthenticate(req,res,next){
  let decoded = jwt.verify(req.token, 'mysupersecretkey');
  if(decoded !== null)
    req.user = decoded;
    next();
}

//check the right format of payload jwt
export function checkFormatJwt(req: any, res: any, next: any){
    const userRole = req.user.role;
    const userEmail = req.user.email;
    const isRight: boolean = ((userRole === "Player" || userRole === "Admin")
                            && (typeof(userEmail) === "string")
                            && (typeof(userRole) === "string")
                            && (userEmail !== "ai"));
    if(isRight){
        next();
    }
    else{
        res.send("Your payload has bad format");
    }
}

//check if exist a game active for the user that sends the request
export async function checkExistingGame(req: any, res: any, next: any){
    const userReq = req.user.email;
    let isInGame: boolean = false;
    let playerTwoInGame: boolean = false;
    
    await GameClass.Game.findAll({
        where:
            {status: "In progress"}
    }).then((gameActive: any) => {

        if(gameActive.length === 0){
            console.log("You can play");
            next();
        }
        else {
            gameActive.forEach(el => {
                if( (el.playerOne == userReq || el.playerTwo == userReq) ){
                    isInGame = true;
                }
                else {
                    if( (el.playerOne == req.body.playerTwo || el.playerTwo == req.body.playerTwo) 
                        && req.body.playerTwo!== 'ai'){
                    playerTwoInGame = true;
                    }
                         
                }
            });
            if(isInGame || playerTwoInGame){
                res.send("Error: you are already in a game or the other player is already in a game");
            }
            else{
            next();
            }
        }
        
    });
}

//funzione per verificzare se l'utente che crea la partita esiste nel db

export async function checkUserExistence(req: any, res: any, next: any){
    const userReq = req.user.email;
    await UserClass.User.findOne({
        where:
            {email: userReq}
    }).then((user: any) => {
        if(user !== null){
            next();
        }
        else{
            res.send("Your email doesn't exist");
        }
    })
}

//funzione che verifica la validità dell'utente che invia la richiesta di partita
export async function verifyUserTwo(req: any, res: any, next: any){
    const userReq = req.user.email;
    const secondUser = req.body.playerTwo;
    if(userReq === secondUser){
        res.send("You can't play with yourself");
    }
    else{
        next();
    }
}

//funzione per verificare se l'utente che manda la mossa è quello specificato in game.turn
export async function isYourCurrentTurn(req: any, res: any, next: any){
    const userReq = req.user.email;
    await GameClass.Game.findOne({
        where: 
            {id_game: req.body.id_game}
    }
    ).then((currGame: any) => {
        if(currGame.turn === userReq){
            next();
        }
        else{
            return res.send("It is not your turn");
        }
    });
    
}

//funzione per assicurare che solo i 2 player del gioco inviino la mossa 
export async function checkAuthMove(req: any, res: any, next:any){
    await GameClass.Game.findOne({
        where:
            {id_game: req.body.id_game}
    }).then((game: any) => {
        if(req.user.email === game.playerOne || req.user.email === game.playerTwo){
            next();
        }
        else{
            res.send("You are not authorized");
        }
    })
}


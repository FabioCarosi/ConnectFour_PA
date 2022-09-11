
import * as GameClass from '../models/game';
import * as UserClass from '../models/user';
import { ErrEnum } from '../Factory/ErrorFactory';
const jwt = require('jsonwebtoken');

export var requestTime = function (req, res, next) {
    req.requestTime = Date.now();
    next();
  };

export var checkHeader = function(req, res, next){

    try{
        const authHeader = req.headers.authorization;
        if (authHeader) {
            next();
        }else{
            next(ErrEnum.NoAuth);
        }
    }catch(err){
        next(ErrEnum.GenericError);
    }
};


export function checkToken(req,res,next){
    try{const bearerHeader = req.headers.authorization;
        if(typeof bearerHeader!=='undefined'){
            const bearerToken = bearerHeader.split(' ')[1];
            req.token=bearerToken;
            next();
        }else{
            next(ErrEnum.ErrToken);
        }
    }catch(err){
        next(ErrEnum.GenericError);
    }
  
}

export function verifyAndAuthenticate(req,res,next){
  try{
    let decoded = jwt.verify(req.token, 'mysupersecretkey');
    if(decoded !== null)
        req.user = decoded;
        next();
    }catch(err){
        next(ErrEnum.ErrKeyToken);
    }
}

enum role {
    Admin = "Admin",
    Player = "Player"
}
//check the right format of payload jwt
export function checkFormatJwt(req: any, res: any, next: any){
    try{
        const userRole = req.user.role;
        const userEmail = req.user.email;
        const isRight: boolean = ((userRole === role.Admin || userRole === role.Player)
                                && (typeof(userEmail) === "string")
                                && (typeof(userRole) === "string")
                                && (userEmail !== "ai"));
        if(isRight){
            next();
        }
        else{
            next(ErrEnum.BadFormatPayload);
        }
    }catch(err){
        next(ErrEnum.GenericError);
    }
}

//verifica che il ruolo sia Admin
export async function authAdmin(req: any, res: any, next: any){
    try {
        const myRole = req.user.role;
        if(myRole === role.Admin){
            next();
        }
        else{
            next(ErrEnum.NoAuth);
        }
    } catch (error) {
            next(ErrEnum.GenericError);
    }
    
}

//check if exist a game active for the user that sends the request
export async function checkExistingGame(req: any, res: any, next: any){
    try{
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
                    next(ErrEnum.ErrExistingGame);
                }
                else{
                next();
                }
            }
            
        });
    }catch(err){
        next(ErrEnum.GenericError);
    }
}

//funzione per verificarre se l'utente nel playload esiste nel db

export async function checkUserExistence(req: any, res: any, next: any){
    try{
        const userReq = req.user.email;
        await UserClass.User.findOne({
            where:
                {email: userReq}
        }).then((user: any) => {
            if(user !== null){
                next();
            }
            else{
                next(ErrEnum.ErrUserExistence);
            }
        })
    }catch(err){
        next(ErrEnum.GenericError);
    }
}

//funzione che verifica la validità dell'utente che invia la richiesta di partita
export async function verifyUserTwo(req: any, res: any, next: any){
    try{
        const userReq = req.user.email;
        const secondUser = req.body.playerTwo;
        if(userReq === secondUser){
            next(ErrEnum.ErrUserTwo);
        }
        else{
            next();
        }
    }catch(err){
        next(ErrEnum.GenericError);
    }
}

//funzione per verificare il credito sufficiente dell'utente che invia la richiesta di gioco
export async function checkUserCredit(req: any, res: any, next: any){
    try{
        const userReq = req.user.email;
    
        const userReqCredit = await UserClass.getCredit(userReq);
        
        if(userReqCredit < 0.35){
            next(ErrEnum.ErrCredit);
        }
        
        else{
            next();
        }
    }catch(err){
        next(ErrEnum.GenericError);
    }
    
}

//funzione per verificare se l'utente che manda la mossa è quello specificato in game.turn
export async function isYourCurrentTurn(req: any, res: any, next: any){
    try{
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
                next(ErrEnum.ErrTurn);
            }
        });
    
    }catch(err){
        next(ErrEnum.GenericError);
    }
    
}

//funzione per assicurare che solo i 2 player del gioco inviino la mossa 
export async function checkAuthMove(req: any, res: any, next:any){
    try {
        await GameClass.Game.findOne({
            where:
                {id_game: req.body.id_game}
        }).then((game: any) => {
            if(req.user.email === game.playerOne || req.user.email === game.playerTwo){
                next();
            }
            else{
                next(ErrEnum.NoAuth);
            }
        })
    } catch (error) {
        next(ErrEnum.GenericError);
    }
    
}




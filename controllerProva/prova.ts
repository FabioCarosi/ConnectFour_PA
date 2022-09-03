const { Connect4AI } = require('../node_modules/connect4-ai/index');
const { Connect4 } = require('../node_modules/connect4-ai/index');
const {seq} = require ('sequelize');
//import * as HvsH from ('../node_modules/connect4-ai/human-vs-human');
import * as GameClass from '../models/game';
import * as MoveClass from '../models/move';
//rotta per creare una partita

export async function startGame(req: any, res:any): Promise<void> {
  console.log("Now");
    //la richiesta contiene l'email dell'user richiedente e l'email dell'user destinatario
    try{
    await GameClass.Game.create(req.body).then((game:any) =>{
      console.log("Game has started");
      const newGame = new Connect4();
      res.send(newGame.ascii());
      res.send(newGame.gameStatus());
      const email = game.playerOne;
      //con sequelize aggiorna credito --> mettila in user.ts
    });
    }
    catch(err){
      res.send("An error has occurred ...");
    }
    /*const newGame = await new Connect4();
    console.log("Game is started\n");
    //if user has a game already setted then error
    req.body.credito = req.body.credito - 0.35;
    
    console.log("Credito rimanente: ",req.body.credito);
    res.header("Content-Type", "application/json");*/
      
  };

/*
export async function makeMove(req:any,res:any){
    //crea Mossa sul db
    try{
      await MoveClass.Move.create(req.body).then((move: any) => {
          const arrMoves[]= move.findMovesbyGame(move.id_game);
          //const newGame = new Connect4();
          arrMoves.forEach(humanPlay => HvsH.handlePlay(humanPlay));
    
      });
      
    }
    catch(err){

    }
    //mossa = n colonna
                  
          

}  


let req = {
    "email": "Cri",
    "credito":50,
    "emailDest":"Fabio",
    "creditoDest":50
}

let res = {

}
*/
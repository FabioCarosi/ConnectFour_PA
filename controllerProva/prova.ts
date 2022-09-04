const { Connect4AI } = require('../node_modules/connect4-ai/index');
const { Connect4 } = require('../node_modules/connect4-ai/index');
const {seq} = require ('sequelize');
//const {HvsH} = require('../node_modules/connect4-ai/human-vs-human');
import * as GameClass from '../models/game';
import * as MoveClass from '../models/move';
//rotta per creare una partita

export async function startGame(req: any, res:any): Promise<void> {
  console.log("Now");
    //la richiesta contiene l'email dell'user richiedente e l'email dell'user destinatario
    try{
    await GameClass.Game.create(req.body).then((game:any) =>{
      console.log("Game has started");
      console.log(game.id_game);
      const newGame = new Connect4();
      console.log(newGame.ascii());
      res.send({"status":newGame.gameStatus()});
      console.log("Body has been sent");
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


export async function makeMove(req:any,res:any){
    //crea Mossa sul db
    console.log("Make a move...");
    try{
      await MoveClass.Move.create(req.body).then((move: any) => {
          console.log("A move has been made");
          //find all moves corrisponding to id_game of current game
          const allMoves = MoveClass.findMovesbyGame(move.id_game).then((movesByGame: any) => {
            console.log(movesByGame);
            /* output:
            [
                 {
                  id_move: 1,
                  id_game: 1,
                  email_user: 'Cri',
                  column_move: 1,
                  timestamp_move: 2022-09-04T19:17:12.000Z
                }
            ]
            */
            console.log(typeof(movesByGame)); //output: object 
            console.log(movesByGame.column_move); //output: undefined
            const {column_move} = movesByGame; //try to take the property column_move
            console.log({column_move}); //output: { column_move : undefined} ??

            console.log("Moves found in game");
            const newGame = new Connect4();
            console.log("game");
            column_move.forEach(humanPlay => handlePlay(humanPlay));

            function handlePlay(column) {
              if(newGame.gameStatus().gameOver) return;
              if(!newGame.canPlay(column)) return;
              
              newGame.play(column);
              displayBoard(newGame.ascii());
              updateStatus(newGame.gameStatus());
             }

            function displayBoard(board) {
              console.log(`Column ${newGame.plays[newGame.plays.length - 1]} was played ${board}`);
            }
            function updateStatus(status) {
              console.log('\n', status, '\n');
            }
    
          });

          
      });
    
    }
    catch(err){
      res.send("An error has occurred...");
    }
    //mossa = n colonna
                  
          

} ;

/*
let req = {
    "email": "Cri",
    "credito":50,
    "emailDest":"Fabio",
    "creditoDest":50
}

let res = {

}
*/
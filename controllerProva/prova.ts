const { Connect4AI } = require('../node_modules/connect4-ai/index');
const { Connect4 } = require('../node_modules/connect4-ai/index');
import * as GameClass from '../models/game';
//rotta per creare una partita

export async function startGame(req: any, res:any): Promise<void> {
    /*la richiesta contiene l'email dell'user richiedente e l'email dell'user destinatario
    */
    //
    const game = await (GameClass.Game.create(req.body)).
      then(
        GameClass.changeState(res, req);)
    const newGame = await new Connect4();
    console.log("Game is started\n");
    //if user has a game already setted then error
    req.body.credito = req.body.credito - 0.35;
    
    console.log("Credito rimanente: ",req.body.credito);
    res.header("Content-Type", "application/json");
      
    }
    
export async function makeMove(req:any,res:any){
    //crea Mossa sul db
    //mossa = n colonna
    const newGame;
        
          moves.forEach(humanPlay => handlePlay(humanPlay));
          
         
          function handlePlay(column) { 
            if(newGame.gameStatus().gameOver) return;
            if(!newGame.canPlay(column)) return; // canplay() indicates whether a (zero-based index) column is playable.
              
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
    

}  


let req = {
    "email": "Cri",
    "credito":50,
    "emailDest":"Fabio",
    "creditoDest":50
}

let res = {

}

const { Connect4AI } = require('../node_modules/connect4-ai/index');
const { Connect4 } = require('../node_modules/connect4-ai/index');
const {seq} = require ('sequelize');
import * as HvsH from '../node_modules/connect4-ai/human-vs-human';
import * as GameClass from '../models/game';
import * as MoveClass from '../models/move';
import * as UserClass from '../models/user';




//rotta per creare una partita

export async function startGame(req: any, res:any): Promise<void> {
  console.log("Now");
  let newGame;
    //la richiesta contiene l'email dell'user richiedente e l'email dell'user destinatario
    try{
    await GameClass.Game.create(req.body).then((game:any) =>{
      console.log("Game has started");

      if(game.playerTwo === 'ai'){
        newGame = new Connect4AI();
      }
      else{
        newGame = new Connect4();
      }
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
          const moveArr: number[] = [];
        
          //find all moves corrisponding to id_game of current game
          const allMoves = MoveClass.findMovesbyGame(move.id_game).then((movesByGame: any) => {
            console.log(movesByGame); //array of objects where every object is a move in the game
            
            movesByGame.forEach(el => moveArr.push(el.column_move));
            console.log(moveArr); //array of moves (columns) in the game

            console.log("Moves found in game");
            //find playerTwo in the game to select IA or UserVSUser mode
            let userTwo =  UserClass.findPlayerTwoByGame(move.id_game).then((gameFound: any) => {
              console.log(gameFound); //an object representing the game 
              console.log(typeof(gameFound)); //object
            
              console.log(gameFound.playerTwo); //email of the second user
              console.log(typeof(gameFound.playerTwo)); //string

              let newGame = new Connect4AI(); 

              console.log("game");

              moveArr.forEach(el => {newGame.play(el)});
              console.log(newGame.ascii());
              console.log(newGame.gameStatus());

              if(gameFound.playerTwo === "ai"){
                console.log("parte l'if");
                const difficulty = GameClass.getDifficulty(move.id_game).then((diff: any) => {
                  console.log(diff.difficulty);
                  console.log(typeof(diff.difficulty));
                  const play = newGame.playAI(diff.difficulty);
                  console.log(play);
                  console.log(newGame.ascii());
                  console.log(newGame.gameStatus());
                  //create AI move in db
                   if(!newGame.gameStatus().gameOver) {
                    MoveClass.Move.create( {
                    "id_game": req.body.id_game,
                    "email_user": "ai",
                    "column_move": play
                  });
                }
                });

                
                

              }
              else{
                console.log("parte l'else"); 
              }

             
            });

           
    
          });

          
      });
      
      

    }
    catch(err){
      res.send("An error has occurred...");
    }
    //mossa = n colonna
                  
          

} 

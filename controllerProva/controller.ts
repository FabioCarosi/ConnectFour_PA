const { Connect4AI } = require('../node_modules/connect4-ai/index');
const { Connect4 } = require('../node_modules/connect4-ai/index');
const {seq} = require ('sequelize');


import * as GameClass from '../models/game';
import * as MoveClass from '../models/move';
import * as UserClass from '../models/user';




//rotta per creare una partita

export async function startGame(req: any, res:any): Promise<void> {
  console.log("Now");
  let newGame;
  req.body.playerOne = req.user.email;
  let lessCredit = 0.35;
  
  
    try{
    await GameClass.Game.create(req.body).then((game:any) =>{
      console.log("Game has started");
      //aggiorna credito playerOne
      UserClass.updateCredit(req.user.email, lessCredit);
    

      if(game.playerTwo === 'ai'){
        newGame = new Connect4AI();    
      }
      else{
        newGame = new Connect4();
        //aggiorna credito playerTwo
        UserClass.updateCredit(req.body.playerTwo, lessCredit);
        
      }
      console.log(newGame.ascii());
      res.send({"Turn": game.turn});

    });
  
    }
    catch(err){
      res.send("An error has occurred ...");
    }

   

      
  };


export async function makeMove(req:any,res:any){
    req.body.email = req.user.email;
    //create move on database
    try{
      await MoveClass.Move.create(req.body).then((move: any) => {
          const moveArr: number[] = [];
        
          //find all moves corrisponding to id_game of current game
          const allMoves = MoveClass.findMovesbyGame(move.id_game).then((movesByGame: any) => {
            
            movesByGame.forEach(el => moveArr.push(el.column_move));
            console.log("Set of all moves: ", moveArr); //array of moves (columns) in the game

            //find playerTwo in the game to select IA or UserVSUser mode
            UserClass.findPlayerTwoByGame(move.id_game).then((playerTwo: any) => {

              console.log("You are playing against: ", playerTwo); //email of the second user

              let newGame = new Connect4AI(); 

              moveArr.forEach(el => {newGame.play(el)});

              console.log(newGame.ascii());
              console.log(newGame.gameStatus());
              
              //select UserVSUser or AI mode
              if(playerTwo === "ai"){
                console.log("parte l'if");
                  //get difficulty inserted by user
                  GameClass.getDifficulty(move.id_game).then((diff: any) => {
                  console.log("Difficulty of game:", diff.difficulty);
                  
                  const play = newGame.playAI(diff.difficulty); //ai plays
                  console.log("Ai has played column: ",play);
                  console.log(newGame.ascii());
                  console.log(newGame.gameStatus());
                  
                                
                  //create AI move in db if game is not over 
                   if(!newGame.gameStatus().gameOver) {
                    MoveClass.Move.create( {
                    "id_game": req.body.id_game,
                    "email": "ai",
                    "column_move": play
                  });
                }
                });

                
                

              }
              
              if (newGame.gameStatus().gameOver) {
                GameClass.updateGameOver(req.body.id_game);
                GameClass.updateWinner(
                  req.body.id_game,
                  newGame.gameStatus().winner
                );
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

const { Connect4AI } = require('./index');
const { Connect4 } = require('./index');
//rotta per creare una partita
export async function startGame(req: any): Promise<void> {
    /*la richiesta contiene l'email dell'user richiedente e l'email dell'user destinatario
    */
    //await Game.game.create(req.body)
    const newGame = await new Connect4();
    console.log("Game is started");
    //if user has a game already setted then error
    req.credito = req.credito - 0.35;
    if(req.emailDest!=="AI"){
    const moves = [
        3, 2, 
        4, 4, 
        3, 3,
        2, 5,
        1, 1,
        1, 4,
        1, 2,
        2, 3,
        3, 6,
        5, 5
      ];
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

      console.log("Credito rimanente: ",req.credito);
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

startGame(req);
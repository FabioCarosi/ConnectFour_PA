import * as GameClass from "../models/game";
import * as UserClass from "../models/user";

//check if id_game of the move corrisponds to an existing game
export async function checkGameExistence(req: any, res: any, next: any) {
  await GameClass.Game.findOne({
    where: { id_game: req.body.id_game },
  }).then((game: any) => {
    if (game != null) {
      next();
    } else {
      res.send("Game doesn't exist");
    }
  });
}

//funzione che verifica l'esistenza del playerTwo nel payload dell'invio della richiesta di una nuova partita
export async function checkPlayerTwoExistence(req: any, res: any, next: any) {
  const userTwo = req.body.playerTwo;
  await UserClass.User.findOne({
    where: { email: userTwo },
  }).then((user: any) => {
    if (user != null) {
      next();
    } else {
      res.send("Second player doesn't exist");
    }
  });
}

//restituisce errore se lo stato della partita è gameOver
export async function isGameOver(req: any, res: any, next: any) {
  await GameClass.Game.findOne({
    where: { id_game: req.body.id_game },
    attributes: ["status"],
  }).then((game: any) => {
    console.log(game.status);
    if (game.status === "Game Over") {
      res.send("Game is over");
    } else {
      next();
    }
  });
}

//funzione che verifica l'ammissibilità della mossa (non deve superare la griglia del gioco)

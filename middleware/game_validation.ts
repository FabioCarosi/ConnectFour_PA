import { ErrEnum } from "../Factory/ErrorFactory";
import * as GameClass from "../models/game";
import * as UserClass from "../models/user";

//check if id_game of the move corrisponds to an existing game
export async function checkGameExistence(req: any, res: any, next: any) {
  try {
    await GameClass.Game.findOne({
      where: { id_game: req.body.id_game },
    }).then((game: any) => {
      if (game != null) {
        next();
      } else {
        next(ErrEnum.ErrGameExistence);
      }
    });
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

//funzione che verifica l'esistenza del secondo utente nel payload dell'invio della richiesta di una nuova partita
export async function checkPlayerTwoExistence(req: any, res: any, next: any) {
  try {
    const userTwo = req.body.playerTwo;

    await UserClass.User.findOne({
      where: { email: userTwo },
    }).then((user: any) => {
      if (user != null) {
        next();
      } else {
        next(ErrEnum.ErrUserExistence);
      }
    });
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

export async function adapterCheckPlayerTwo(req: any, res: any, next: any) {
  try {
    req.body.playerTwo = req.body.email;
    next();
  } catch (err) {
    next(ErrEnum.GenericError);
  }
}

//restituisce errore se lo stato della partita è gameOver
export async function isGameOver(req: any, res: any, next: any) {
  try {
    await GameClass.Game.findOne({
      where: { id_game: req.body.id_game },
      attributes: ["status"],
    }).then((game: any) => {
      console.log(game.status);
      if (game.status !== "In progress") { //game is over or out of time 
        next(ErrEnum.ErrGameOver);
      } else {
        next();
      }
    });
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

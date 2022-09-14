import { ErrEnum } from "../Factory/ErrorFactory";
import * as GameClass from "../models/game";
import * as UserClass from "../models/user";
import * as strings from "../strings";

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

//check if the player that the user wants to play against, exists in DB
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
//this adapter is used when admin whant to charge user's credit
//The next middleware is checkPlayerExistence, that take in input "req.body.playerTwo"
//In this case, in our request's body there's "req.body.email", so we have to convert it in order to make the next middleware work
export async function adapterCheckPlayerTwo(req: any, res: any, next: any) {
  try {
    req.body.playerTwo = req.body.email;
    next();
  } catch (err) {
    next(ErrEnum.GenericError);
  }
}

//check if id_game specified corrisponds to a game "In progress"
//If game is over, that middleware returns error
export async function isGameOver(req: any, res: any, next: any) {
  try {
    await GameClass.Game.findOne({
      where: { id_game: req.body.id_game },
      attributes: ["status"],
    }).then((game: any) => {
      console.log(game.status);
      if (game.status !== strings.inProgress) {
        //game is over or out of time
        next(ErrEnum.ErrGameOver);
      } else {
        next();
      }
    });
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

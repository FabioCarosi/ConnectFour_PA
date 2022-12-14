require("dotenv").config();
import { ErrEnum } from "../Factory/ErrorFactory";
import * as GameClass from "../models/game";
import * as UserClass from "../models/user";
import * as strings from "../strings";
const jwt = require("jsonwebtoken");

export var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

export var checkHeader = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      next();
    } else {
      next(ErrEnum.NoAuth);
    }
  } catch (err) {
    next(ErrEnum.GenericError);
  }
};

export function checkToken(req, res, next) {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      req.token = bearerToken;
      next();
    } else {
      next(ErrEnum.ErrToken);
    }
  } catch (err) {
    next(ErrEnum.GenericError);
  }
}

export function verifyAndAuthenticate(req, res, next) {
  try {
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
    if (decoded !== null) {
      req.user = decoded;
      next();
    }
  } catch (err) {
    next(ErrEnum.ErrKeyToken);
  }
}

//check the right format of payload jwt
export function checkFormatJwt(req: any, res: any, next: any) {
  try {
    const userRole = req.user.role.toLowerCase();
    const userEmail = req.user.email.toLowerCase();
    const isRight: boolean =
      (userRole === strings.admin || userRole === strings.player) &&
      typeof userEmail === "string" &&
      typeof userRole === "string" &&
      userEmail !== strings.ai; //user in payload cannot be "ai"
    if (isRight) {
      next();
    } else {
      next(ErrEnum.BadFormatPayload);
    }
  } catch (err) {
    next(ErrEnum.GenericError);
  }
}

//validation middleware that is called whenever the user must be admin
export async function authAdmin(req: any, res: any, next: any) {
  try {
    const myRole = req.user.role.toLowerCase();
    const dbRole = await UserClass.findUserAdmin(req.user.email);
    if (myRole === strings.admin && dbRole.toLowerCase() === strings.admin) {
      next();
    } else {
      next(ErrEnum.NoAuth);
    }
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

//check if exist a game active for the user that sends the request and for the second player the user wants to play against
export async function checkExistingGame(req: any, res: any, next: any) {
  try {
    const userReq = req.user.email;
    let isInGame: boolean = false;
    let playerTwoInGame: boolean = false;

    await GameClass.Game.findAll({
      where: { status: strings.inProgress }, //find all games that are in progress (so they are not over yet)
    }).then((gameActive: any) => {
      if (gameActive.length === 0) {
        console.log("You can play");
        next();
      } else {
        gameActive.forEach((el) => {
          if (el.playerOne == userReq || el.playerTwo == userReq) {
            isInGame = true; //user who sends the request is already in an active game
          } else {
            if (
              (el.playerOne == req.body.playerTwo ||
                el.playerTwo == req.body.playerTwo) &&
              req.body.playerTwo !== strings.ai //The ai can be in multiple active games
            ) {
              playerTwoInGame = true; //the second player is already in an active game
            }
          }
        });
        if (isInGame || playerTwoInGame) {
          //if one of the player is active in another game, you can't create a new game
          next(ErrEnum.ErrExistingGame);
        } else {
          next();
        }
      }
    });
  } catch (err) {
    next(ErrEnum.GenericError);
  }
}

//check if user in payload exists in DB
export async function checkUserExistence(req: any, res: any, next: any) {
  try {
    const userReq = req.user.email;
    await UserClass.User.findOne({
      where: { email: userReq },
    }).then((user: any) => {
      if (user !== null) {
        next();
      } else {
        next(ErrEnum.ErrUserExistence);
      }
    });
  } catch (err) {
    next(ErrEnum.GenericError);
  }
}

//check if who sends the request is not equal to second player
export async function verifyUserTwo(req: any, res: any, next: any) {
  try {
    const userReq = req.user.email;
    const secondUser = req.body.playerTwo;
    if (userReq === secondUser) {
      next(ErrEnum.ErrUserTwo);
    } else {
      next();
    }
  } catch (err) {
    next(ErrEnum.GenericError);
  }
}

//check if user has enough credit to play
export async function checkUserCredit(req: any, res: any, next: any) {
  try {
    const userReq = req.user.email;

    const userReqCredit = await UserClass.getCredit(userReq);

    if (userReqCredit < 0.35) {
      next(ErrEnum.ErrCredit);
    } else {
      next();
    }
  } catch (err) {
    next(ErrEnum.GenericError);
  }
}

//check if the user that sends the move is the one specified in game.turn
//In other words, check if is the turn of who sends the move
export async function isYourCurrentTurn(req: any, res: any, next: any) {
  try {
    const userReq = req.user.email;
    await GameClass.Game.findOne({
      where: { id_game: req.body.id_game },
    }).then((currGame: any) => {
      if (currGame.turn === userReq) {
        next();
      } else {
        next(ErrEnum.ErrTurn);
      }
    });
  } catch (err) {
    next(ErrEnum.GenericError);
  }
}

//check that only the two players in the game (playerOne and playerTwo) can send moves in that game
export async function checkAuthMove(req: any, res: any, next: any) {
  try {
    await GameClass.Game.findOne({
      where: { id_game: req.body.id_game },
    }).then((game: any) => {
      if (
        req.user.email === game.playerOne ||
        req.user.email === game.playerTwo
      ) {
        next();
      } else {
        next(ErrEnum.NoAuth);
      }
    });
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

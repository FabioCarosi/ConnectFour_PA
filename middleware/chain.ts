import * as body from "./body_validation";
import * as game from "./game_validation";
import * as Jwt from "./Jwt";

export const JwtValidation = [
  Jwt.requestTime,
  Jwt.checkHeader,
  Jwt.checkToken,
  Jwt.verifyAndAuthenticate,
  Jwt.checkFormatJwt,
];

export const gameValidation = [
  body.gameBodyValidation,
  Jwt.checkUserExistence,
  game.checkPlayerTwoExistence,
  Jwt.verifyUserTwo,
  Jwt.checkExistingGame,
  Jwt.checkUserCredit,
];
export const moveValidation = [
  body.moveBodyValidation,
  Jwt.checkUserExistence,
  game.checkGameExistence,
  Jwt.checkAuthMove,
  game.isGameOver,
  Jwt.isYourCurrentTurn,
];

export const leaveValidation = [Jwt.checkLeaveGame];

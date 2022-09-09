import * as body from "./body_validation";
import * as game from "./game_validation";
import * as Jwt from "./Jwt";
//import * as view from './view_validation';

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
export const leaveValidation = [
  Jwt.checkUserExistence,
  game.checkGameExistence,
  Jwt.checkAuthMove,
  game.isGameOver,
];

export const viewValidation = [
  Jwt.checkUserExistence,
  //view.checkGetFormat
];

export const stateValidation = [Jwt.checkAuthMove, game.checkGameExistence];

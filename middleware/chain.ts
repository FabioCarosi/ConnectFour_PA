import * as body from "./body_validation";
import * as game from "./game_validation";
import * as Jwt from "./Jwt";
import * as view from './view_validation';
import * as validErrHandler from './validationErrorHandler';

export const JwtValidation = [
  Jwt.requestTime,
  Jwt.checkHeader,
  Jwt.checkToken,
  Jwt.verifyAndAuthenticate,
  Jwt.checkFormatJwt,
  validErrHandler.validErrorHandler
];

export const gameValidation = [
  body.gameBodyValidation,
  Jwt.checkUserExistence,
  game.checkPlayerTwoExistence,
  Jwt.verifyUserTwo,
  Jwt.checkExistingGame,
  Jwt.checkUserCredit,
  validErrHandler.validErrorHandler
];
export const moveValidation = [
  body.moveBodyValidation,
  Jwt.checkUserExistence,
  game.checkGameExistence,
  Jwt.checkAuthMove,
  game.isGameOver,
  Jwt.isYourCurrentTurn,
  validErrHandler.validErrorHandler
];
export const leaveValidation = [
  Jwt.checkUserExistence,
  game.checkGameExistence,
  Jwt.checkAuthMove,
  game.isGameOver,
  validErrHandler.validErrorHandler
];

export const viewValidation = [
  Jwt.checkUserExistence,
  view.checkGetFormat,
  validErrHandler.validErrorHandler
];

export const stateValidation = [
    Jwt.checkAuthMove,
    game.checkGameExistence,
    validErrHandler.validErrorHandler
];

export const chargeValidation = [
    Jwt.checkUserExistence,
    Jwt.authAdmin,
    game.adapterCheckPlayerTwo,
    game.checkPlayerTwoExistence,
    validErrHandler.validErrorHandler
];
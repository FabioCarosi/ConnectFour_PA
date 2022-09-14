import * as body from "./body_validation";
import * as game from "./game_validation";
import * as Jwt from "./Jwt";
import * as root from "./root_validation";
import * as validErrHandler from "./validationErrorHandler";
import * as view from "./view_validation";

/*
  Chain of responsability
*/

export const JwtValidation = [
  Jwt.requestTime,
  Jwt.checkHeader,
  Jwt.checkToken,
  Jwt.verifyAndAuthenticate,
  Jwt.checkFormatJwt,
  validErrHandler.validErrorHandler,
];

//chain for validation of /startGame root
export const gameValidation = [
  body.gameBodyValidation,
  Jwt.checkUserExistence,
  game.checkPlayerTwoExistence,
  Jwt.verifyUserTwo,
  Jwt.checkExistingGame,
  Jwt.checkUserCredit,
  validErrHandler.validErrorHandler,
];

//chain for validation of /makeMove root
export const moveValidation = [
  body.moveBodyValidation,
  Jwt.checkUserExistence,
  game.checkGameExistence,
  Jwt.checkAuthMove,
  game.isGameOver,
  Jwt.isYourCurrentTurn,
  validErrHandler.validErrorHandler,
];

//chain for validation of /leaveGame root
export const leaveValidation = [
  body.leaveBodyValidation,
  Jwt.checkUserExistence,
  game.checkGameExistence,
  Jwt.checkAuthMove,
  game.isGameOver,
  validErrHandler.validErrorHandler,
];

//chain for validation of /viewGamesByUser root
export const viewValidation = [
  Jwt.checkUserExistence,
  view.checkGetFormat,
  validErrHandler.validErrorHandler,
];

//chain for validation of /stateGame root
export const stateValidation = [
  body.leaveBodyValidation,
  Jwt.checkUserExistence,
  game.checkGameExistence,
  validErrHandler.validErrorHandler,
];

//chain for validation of /chargeCredit root
export const chargeValidation = [
  body.chargeCreditBodyValidation,
  Jwt.checkUserExistence,
  Jwt.authAdmin,
  game.adapterCheckPlayerTwo,
  game.checkPlayerTwoExistence,
  validErrHandler.validErrorHandler,
];

//chain for validation of //allMoves root
export const listValidation = [
  body.listBodyValidation,
  Jwt.checkUserExistence,
  game.checkGameExistence,
  validErrHandler.validErrorHandler,
];

export const rootValidation = [
  root.rootValidation,
  validErrHandler.validErrorHandler,
];

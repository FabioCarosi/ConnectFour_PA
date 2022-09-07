import * as Jwt from './Jwt';
import * as game from './game_validation';

export const JwtValidation = [
    Jwt.requestTime,
    Jwt.checkHeader,
    Jwt.checkToken,
    Jwt.verifyAndAuthenticate,
    Jwt.checkFormatJwt
]

export const gameValidation = [
    Jwt.checkUserExistence,
    game.checkPlayerTwoExistence,
    Jwt.verifyUserTwo,
    Jwt.checkExistingGame
]
export const moveValidation = [
    Jwt.checkUserExistence,
    game.checkGameExistence,
    Jwt.checkAuthMove,
    game.isGameOver,
    Jwt.isYourCurrentTurn
]

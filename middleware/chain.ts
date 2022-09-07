import * as Jwt from './Jwt';
import * as game from './game_validation';

export const JwtValidation = [
    Jwt.requestTime,
    Jwt.checkHeader,
    Jwt.checkToken,
    Jwt.verifyAndAuthenticate
]

export const gameValidation = [
    Jwt.checkUserExistence,
    Jwt.verifyUserTwo,
    Jwt.checkExistingGame
]
export const moveValidation = [
    Jwt.checkUserExistence,
    game.checkGameExistence,
    Jwt.checkAuthMove,
    Jwt.isYourCurrentTurn
]

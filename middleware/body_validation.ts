import { ErrEnum } from '../Factory/ErrorFactory';

export async function gameBodyValidation(req: any, res: any, next: any) {
  try {
    const user = req.body.playerTwo;
    if (typeof user === "string") {
      next();
    } else {
      next(ErrEnum.ErrBodyFormat);
    }
  } catch (error) {
      next(ErrEnum.GenericError);
  }
  
}

export async function moveBodyValidation(req: any, res: any, next: any) {
  try {
    const idGame = req.body.id_game;
    const col = req.body.column_move;

    if (
      typeof idGame === "number" &&
      typeof col === "number" &&
      col >= 0 &&
      col <= 6
    ) {
      next();
    } else {
      next(ErrEnum.ErrBodyFormat);
    }
  } catch (error) {
    next(ErrEnum.GenericError);
  }
  
}

import { ErrEnum } from "../Factory/ErrorFactory";
import * as strings from "../strings";

/*
  Here, there are all the middleware functions that validates request's body
*/

export async function gameBodyValidation(req: any, res: any, next: any) {
  try {
    const user = req.body.playerTwo;
    let checkAI: boolean = true;

    if (user === strings.ai) {
      const difficulty = req.body.difficulty;
      if (
        typeof difficulty !== "string" &&
        (difficulty !== strings.easy ||
          difficulty !== strings.medium ||
          difficulty !== strings.hard)
      ) {
        checkAI = false; //it is false when difficulty is not a string and is not one of the possible values of enum
      }
    }
    if (typeof user === "string" && checkAI) {
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

export async function leaveBodyValidation(req: any, res: any, next: any) {
  try {
    const idGame = req.body.id_game;
    if (typeof idGame === "number") {
      next();
    } else {
      next(ErrEnum.ErrBodyFormat);
    }
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

export async function listBodyValidation(req: any, res: any, next: any) {
  try {
    const idGame = req.body.id_game;
    const format = req.body.format;
    const sep = req.body.separator;
    if (
      typeof idGame === "number" &&
      (format === strings.JSON ||
        (format === strings.CSV && //when format === "csv" you must specify separator
          (sep === strings.sep1 ||
            sep === strings.sep2 ||
            sep === strings.sep3)))
    ) {
      next();
    } else {
      next(ErrEnum.ErrBodyFormat);
    }
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

export async function chargeCreditBodyValidation(
  req: any,
  res: any,
  next: any
) {
  try {
    const email = req.body.email;
    const credit = req.body.newCredit;
    if (typeof email === "string" && typeof credit === "number") {
      next();
    } else {
      next(ErrEnum.ErrBodyFormat);
    }
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

import { ErrEnum } from "../Factory/ErrorFactory";

/*
  Here, there are all the middleware functions that validates request's body
*/

export async function gameBodyValidation(req: any, res: any, next: any) {
  try {
    const user = req.body.playerTwo;
    let checkAI: boolean = true;
    enum typeDiff {
      one = "easy",
      two = "medium",
      three = "hard"

    }
    if( user === "ai" ){
      const difficulty = req.body.difficulty;
      if((typeof difficulty !== "string") 
        && ((difficulty !== typeDiff.one) 
            || (difficulty !== typeDiff.two)
            || (difficulty !== typeDiff.three))){

        checkAI = false; //it is false when difficulty is not a string and is not one of the possible values of enum
      }
    }
    if ((typeof user === "string") && checkAI) {
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
    if (
      typeof idGame === "number" 
    ) {
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
    enum formats {
      one = "json",
      two = "csv"
    }
    enum separators {
      one = ",",
      two = ";",
      three = "|"
    }
    if (
      ((typeof idGame === "number") 
      && ((format === formats.one)
      || ((format === formats.two) //when format === "csv" you must specify separator
      && ((sep === separators.one) || (sep === separators.two) || (sep === separators.three)))))
    ) {
      next();
    } else {
      next(ErrEnum.ErrBodyFormat);
    }
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

export async function chargeCreditBodyValidation(req: any, res: any, next: any) {
  try {
    const email = req.body.email;
    const credit = req.body.newCredit;
    if (
      ((typeof email === "string") 
      && typeof credit === "number")
    ) {
      next();
    } else {
      next(ErrEnum.ErrBodyFormat);
    }
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

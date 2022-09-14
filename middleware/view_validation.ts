import { ErrEnum } from "../Factory/ErrorFactory";
import * as strings from "../strings";

//check the format of the request's url
//this is only for /viewGamesByUser root
export async function checkGetFormat(req: any, res: any, next: any) {
  try {
    const typeRequest = req.query.take;
    const typeRequestLower = typeRequest.toLowerCase();
    if (
      typeRequestLower === strings.between ||
      typeRequestLower === strings.greaterThan ||
      typeRequestLower === strings.lessThan
    ) {
      next();
    } else {
      next(ErrEnum.ErrGetFormat);
    }
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

import { ErrEnum } from "../Factory/ErrorFactory";

//check the format of the request's url 
//this is only for /viewGamesByUser root
export async function checkGetFormat(req: any, res: any, next: any) {
  try {
    const typeRequest = req.query.take;

    enum types {
      between = "between",
      greater = "greaterthan",
      less = "lessthan",
    }
    const typeRequestLower = typeRequest.toLowerCase();
    if (
      typeRequestLower === types.between ||
      typeRequestLower === types.greater ||
      typeRequestLower === types.less
    ) {
      next();
    } else {
      next(ErrEnum.ErrGetFormat);
    }
  } catch (error) {
    next(ErrEnum.GenericError);
  }
}

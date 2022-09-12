import { ErrEnum, ErrorFactory } from "../Factory/ErrorFactory";
export function validErrorHandler(
  error: ErrEnum,
  req: any,
  res: any,
  next: any
) {
  const errFactory: ErrorFactory = new ErrorFactory();
  const msgError = errFactory.getError(error).getMsg();
  res.status(msgError.msgStatus);
  console.log(msgError);
  res.send(msgError.msgString);
}

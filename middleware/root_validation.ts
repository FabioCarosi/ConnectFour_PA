import { ErrEnum } from "../Factory/ErrorFactory";

export async function rootValidation (req: any, res: any, next: any){
    next(ErrEnum.ErrInvalidRoot);
}
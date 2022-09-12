import {ErrEnum, ErrorFactory} from '../Factory/ErrorFactory';

export function controllerErrorHandler (error: ErrEnum, res: any){
    const errFactory: ErrorFactory = new ErrorFactory();
    const msgError = errFactory.getError(ErrEnum.GenericError).getMsg();
    /*res.status(msgError.msgStatus);
    console.log(msgError);
    res.send(msgError.msgString);
    */
}
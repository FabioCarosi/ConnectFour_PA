import {SuccEnum, SuccessFactory} from '../Factory/SuccessFactory';

export function controllerSuccessMsg (success: SuccEnum, res: any){
    const succFactory: SuccessFactory = new SuccessFactory();
    const msgSuccess = succFactory.getSuccess(success).getMsg();
    res.status(msgSuccess.msgStatus);
    console.log(msgSuccess);
    return msgSuccess.msgString;
}
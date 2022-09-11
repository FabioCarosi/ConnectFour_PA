import { ErrEnum } from '../Factory/ErrorFactory';

export async function checkGetFormat(req: any, res: any, next: any){
    try {
        const typeRequest = req.query.take;
    
        enum types {
            between= "between",
            greater="greaterThan",
            less="lessThan"
        };

        if((typeRequest === types.between) || (typeRequest === types.greater) || (typeRequest === types.less)){
            next();
        }
        else{
            next(ErrEnum.ErrGetFormat);
        }
    } catch (error) {
        next(ErrEnum.GenericError);
    }
    
}
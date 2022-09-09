/*export async function checkGetFormat(req: any, res: any, next: any){
    const typeRequest = req.query.take;
    enum types {
        "between",
        "greaterThan",
        "lessThan"
    };
    if((typeRequest === types.between) || (typeRequest === types.greaterThan) || (typeRequest === types.lessThan)){
        next();
    }
    else{
        res.send("Post request has invalid field");
    }
}*/
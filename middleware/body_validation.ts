
export async function gameBodyValidation(req: any, res: any, next: any){
    const user = req.body.playerTwo;
    if(typeof(user) === "string"){
        next();
    }
    else{
        res.send("Second user must be a string");
    }
}

export async function moveBodyValidation(req: any, res: any, next: any){
    const idGame = req.body.id_game;
    const col = req.body.column_move;

    if((typeof(idGame) === "number")
     && (typeof(col) === "number")
     && (col >= 0 && col <=6)){
        next();
     }
     else{
        res.send("Body has bad format");
     }
}
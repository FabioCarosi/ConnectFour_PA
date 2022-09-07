import * as GameClass from '../models/game';
import * as UserClass from '../models/user';



//check if id_game of the move corrisponds to an existing game
export async function checkGameExistence(req: any, res: any, next: any){

    await GameClass.Game.findOne({
        where:
            {id_game: req.body.id_game}
    }).then((game: any) => {
        if(game != null){
            next();
        }
        else{
            res.send("Game doesn't exist");
        }
        
    })
};

//controlla se playerOne e playerTwo sono utenti esistenti
export async function checkPlayerExistence(req: any, res: any, next: any){
    await UserClass.User.findOne({
        where:
            {email: req.body.playerOne }
    }

    )
}

import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "./singletonDB";
import * as GameClass from "./game";

const connection: Sequelize = Singleton.getInstance();

export const User = connection.define("user", {
    email: { 
    type: DataTypes.STRING(),
    primaryKey: true
    },
    credit:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(),
        allowNull: false
    }
});


//funzione asincrona che aggiorna il credito dell'utente

//funzione che trova il playerTwo del game
export async function findPlayerOneByGame(idGame) {

    let game: any = await GameClass.Game.findOne({
  
      where: { id_game: idGame },
  
      raw: true,
  
    });
  
    let user = game.playerOne;
  
    return user;
  
  }
  
  
  
  export async function findPlayerTwoByGame(idGame) {
  
    let game = await GameClass.Game.findOne({
  
      where: { id_game: idGame },
  
      raw: true,
  
    })
    /*const user = gameFound.playerTwo;
    console.log("Chiamata nella funzione: ",user);
    console.log(typeof(user));*/
    return game;
    }

  
  
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
  },
    {
      timestamps: false
  }
);


//funzione asincrona che aggiorna il credito dell'utente

//funzione che trova il playerOne del game
export async function findPlayerOneByGame(idGame) {
  const game: any = await GameClass.Game.findOne({
    where: { id_game: idGame },
    raw: true,
  });
  const user: string = game.playerOne;
  return user;
}

export async function findPlayerTwoByGame(idGame) {
  const game: any = await GameClass.Game.findOne({
    where: { id_game: idGame },
    raw: true,
  });
  const user: string = game.playerTwo;
  return user;
}

//funzione che restituisce il credito dell'utente
export async function getCredit(emailUser){
  const user: any = await User.findOne({
    where: {email: emailUser},
    attributes: ['credit'],
    raw: true
  });
  const credit: number = user.credit;
  return credit;
}
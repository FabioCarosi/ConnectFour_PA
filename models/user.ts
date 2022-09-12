import { DataTypes, Sequelize } from "sequelize";
import * as GameClass from "./game";
import { Singleton } from "./singletonDB";

const connection: Sequelize = Singleton.getInstance();

export const User = connection.define(
  "user",
  {
    email: {
      type: DataTypes.STRING(),
      primaryKey: true,
    },
    credit: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

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

export async function findPlayerTurn(idGame) {
  const game: any = await GameClass.Game.findOne({
    where: { id_game: idGame },
    raw: true,
  });
  const user: string = game.turn;
  return user;
}

//funzione che restituisce il credito dell'utente
export async function getCredit(emailUser: string) {
  const user: any = await User.findOne({
    where: { email: emailUser },
    attributes: ["credit"],
    raw: true,
  });
  const credit: number = user.credit;
  return credit;
}

//funzione che aggiorna il credito dell'utente quando inizia il gioco
export async function updateCredit(emailUser, lessCredit) {
  await User.increment(
    { credit: -lessCredit },
    {
      where: { email: emailUser },
    }
  );
}

export async function findWinnerOutTime(idGame) {
  let user1: string = await findPlayerOneByGame(idGame);
  let user2: string = await findPlayerTwoByGame(idGame);
  let turn: string = await findPlayerTurn(idGame);
  if (turn === user1) return user2;
  if (turn === user2) return user1;
}

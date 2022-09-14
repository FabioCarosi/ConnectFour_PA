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

//find playerOne of a game
export async function findPlayerOneByGame(idGame) {
  const game: any = await GameClass.Game.findOne({
    where: { id_game: idGame },
    raw: true,
  });
  const user: string = game.playerOne;
  return user;
}

//find playerTwo of a game
export async function findPlayerTwoByGame(idGame) {
  const game: any = await GameClass.Game.findOne({
    where: { id_game: idGame },
    raw: true,
  });
  const user: string = game.playerTwo;
  return user;
}

//find the current turn of a game
export async function findPlayerTurn(idGame) {
  const game: any = await GameClass.Game.findOne({
    where: { id_game: idGame },
    raw: true,
  });
  const user: string = game.turn;
  return user;
}

//find user's credit
export async function getCredit(emailUser: string) {
  const user: any = await User.findOne({
    where: { email: emailUser },
    attributes: ["credit"],
    raw: true,
  });
  const credit: number = user.credit;
  return credit;
}

//update user's credit
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

export async function findUserAdmin(emailUser) {
  const user: any = await User.findOne({
    where: { email: emailUser },
  });
  const role: string = user.role;
  return role;
}

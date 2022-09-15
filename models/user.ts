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
  return user; //return the string of the email
}

//find playerTwo of a game
export async function findPlayerTwoByGame(idGame) {
  const game: any = await GameClass.Game.findOne({
    where: { id_game: idGame },
    raw: true,
  });
  const user: string = game.playerTwo;
  return user; //return the string of the email
}

//find the current turn of a game
export async function findPlayerTurn(idGame) {
  const game: any = await GameClass.Game.findOne({
    where: { id_game: idGame },
    raw: true,
  });
  const user: string = game.turn;
  return user; //return the string of the email
}

//find user's credit
export async function getCredit(emailUser: string) {
  const user: any = await User.findOne({
    where: { email: emailUser },
    attributes: ["credit"],
    raw: true,
  });
  const credit: number = user.credit;
  return credit; //return the number of credits remaining
}

//update user's credit
export async function updateCredit(emailUser, lessCredit) {
  await User.increment(
    //it decreases when the game starts and after each move
    //it increases when the admin recharges the credit
    { credit: -lessCredit },
    {
      where: { email: emailUser },
    }
  );
}

export async function findWinnerOutTime(idGame) {
  let user1: string = await findPlayerOneByGame(idGame); //find player 1
  let user2: string = await findPlayerTwoByGame(idGame); //find player 2
  let turn: string = await findPlayerTurn(idGame); //find the player who has to make the move
  if (turn === user1) return user2; //if it is player 1's turn then player 2 returns
  if (turn === user2) return user1; //if it is player 2's turn then player 1 returns
}

export async function findUserAdmin(emailUser) {
  const user: any = await User.findOne({
    where: { email: emailUser },
  });
  const role: string = user.role;
  return role; //return the role saved in db
}

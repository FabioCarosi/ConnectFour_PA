import { DataTypes, Op, Sequelize } from "sequelize";
import * as GameClass from "./game";
import { Singleton } from "./singletonDB";
import * as UserClass from "./user";

const connection: Sequelize = Singleton.getInstance();

export const Move = connection.define(
  "move",
  {
    id_move: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_game: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    column_move: {
      type: DataTypes.TINYINT(),
      allowNull: false,
    },
    timestamp_move: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

/*Game.belongsTo(User, {foreignKey: "email_user",  targetKey: "email"});
Game.belongsTo(Game, {foreignKey: "id_game",  targetKey: "id_game"});*/

/*Once that a move is made, the game's turn changes to the next player*/
Move.addHook("afterCreate", async (move: any, options) => {
  await GameClass.Game.findOne({
    where: { id_game: move.id_game },
  }).then((currGame: any) => {
    if (currGame.turn === currGame.playerOne) {
      GameClass.Game.update(
        { turn: currGame.playerTwo },
        {
          where: { id_game: move.id_game },
        }
      );
      console.log("Now is turn of: ",currGame.playerTwo);
      UserClass.updateCredit(currGame.playerOne, 0.01);
    } else {
      GameClass.Game.update(
        { turn: currGame.playerOne },
        {
          where: { id_game: move.id_game },
        }
      );
      console.log("Now is turn of: ",currGame.playerOne);
    }
  });
});

/*
Finds all moves in a given game
@param idGame game identifier
*/
export async function findMovesbyGame(idGame: any) {
  const allMoves = await Move.findAll({
    where: { id_game: idGame },
    raw: true,
  });

  return allMoves;
}

export async function getTimeByGame(idGame: any, res: any) {
  /* const lastMove = await Move.findOne({
    where: { id_game: idGame },
    order: [["timestamp_move", "DESC"]],
    raw: true,
  });
  console.log(lastMove);
  return lastMove;*/
  let dt = new Date();
  let err;
  dt.setHours(dt.getHours() - 3);
  console.log(dt);

  Move.findAll({
    where: {
      id_game: idGame,
      timestamp_move: {
        [Op.gt]: dt,
      },
    },
  }).then((latestMoves: any) => {
    if (latestMoves.length === 0) {
      GameClass.updateGameOver(idGame);
      err = "Game Over";
    } else {
      err = "BASTA";
    }
    res.send(dt + " " + err);
    return latestMoves;
  });
}

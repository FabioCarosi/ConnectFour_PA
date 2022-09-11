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
      UserClass.updateCredit(currGame.playerOne, 0.01);
    } else {
      GameClass.Game.update(
        { turn: currGame.playerOne },
        {
          where: { id_game: move.id_game },
        }
      );
    }
  });
});

/*
Restituisce tutte le mosse fatte in una certa partita passando come parametro il suo id 
*/
export async function findMovesbyGame(idGame: any) {
  const allMoves = await Move.findAll({
    where: { id_game: idGame },
    //attributes: ['column_move'],
    raw: true,
  });

  return allMoves;
}

export async function checkLastHourMoves(req: any) {
  let dt = new Date();

  dt.setHours(dt.getHours() - 1);
  console.log(dt);

  const latestMoves = await Move.findAll({
    where: {
      id_game: req.body.id_game,
      timestamp_move: {
        [Op.gt]: dt,
      },
    },
  });
  if (latestMoves.length === 0) {
    const opponent = await UserClass.findWinnerOutTime(req.body.id_game);
    console.log("OPPONENT: " + opponent);
    await GameClass.updateGameOver(req.body.id_game, "OutOfTime");
    await GameClass.updateWinner(req.body.id_game, opponent);

    return true;
  } else {
    return false;
  }
}

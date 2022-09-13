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
      console.log("Now is turn of: ", currGame.playerTwo);
      UserClass.updateCredit(currGame.playerOne, 0.01);
    } else {
      GameClass.Game.update(
        { turn: currGame.playerOne },
        {
          where: { id_game: move.id_game },
        }
      );
      console.log("Now is turn of: ", currGame.playerOne);
    }
    setTimeout(
      async() =>  {
       await checkLastHourMoves(move);
     }, 3600000);
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

//function that check how much time has passed from the latest move
export async function checkLastHourMoves(move: any) {
  let dt = new Date();

  dt.setHours(dt.getHours() - 1);
 

  const latestMoves = await Move.findAll({
    where: {
      id_game: move.id_game,
      timestamp_move: {
        [Op.gt]: dt, //find all moves made in the last hour
      },
    },
  });
  if (latestMoves.length === 0) {
    const opponent = await UserClass.findWinnerOutTime(move.id_game);
    await GameClass.updateGameOver(move.id_game, "OutOfTime");
    await GameClass.updateWinner(move.id_game, opponent);
    console.log("Game out of time");
    return true;
  } 
}

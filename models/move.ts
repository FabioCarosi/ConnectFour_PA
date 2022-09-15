import { DataTypes, Op, Sequelize } from "sequelize";
import * as strings from "../strings";
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
  const currGame: any = await GameClass.Game.findOne({
    where: { id_game: move.id_game },
  });
  if (currGame.turn === currGame.playerOne) {
    await GameClass.Game.update(
      { turn: currGame.playerTwo },
      {
        where: { id_game: move.id_game },
      }
    );
    console.log("Now is turn of: ", currGame.playerTwo);
    await UserClass.updateCredit(currGame.playerOne, 0.01);
  } else {
    await GameClass.Game.update(
      { turn: currGame.playerOne },
      {
        where: { id_game: move.id_game },
      }
    );
    console.log("Now is turn of: ", currGame.playerOne);
  }
  setTimeout(
    //set Timeout of 1h, then check if there has been moves since then
    async () => {
      await checkLastHourMoves(move);
    },
    3600000
  );
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
export async function checkLastHourMoves(req: any) {
  let dt = new Date(); //current time

  dt.setHours(dt.getHours() - 1); //current time minus 1hr
  console.log(dt);

  const latestMoves = await Move.findAll({
    where: {
      id_game: req.body.id_game,
      timestamp_move: {
        [Op.gt]: dt, //findAll move in the last hour
      },
    },
  });
  if (latestMoves.length === 0) {
    //if there are no moves
    //then the winner is the one who made the last move
    //that is, the one who does not have the turn
    const opponent = await UserClass.findWinnerOutTime(req.body.id_game);
    await GameClass.updateGameAttributes(
      //then update the game as Out Of Time
      req.body.id_game,
      strings.outOfTime, //draw status = Out of Time
      strings.outOfTime, //game status = Out of Time
      opponent //the winner is the opponent of whoever has to make the move
    );
    return true; //return true if the game is over
  } else {
    return false; //return false if the game is still in progress
  }
}

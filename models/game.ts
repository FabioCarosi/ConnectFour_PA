import { DataTypes, Op, Sequelize } from "sequelize";
import { Singleton } from "./singletonDB";
import * as UserClass from "./user";
import * as MoveClass from "./move";
import { controllerSuccessMsg } from "../controller/controllerSuccessMessage";
import { ErrEnum } from "../Factory/ErrorFactory";
import { SuccEnum, SuccessFactory } from "../Factory/SuccessFactory";

const connection: Sequelize = Singleton.getInstance();

export const Game = connection.define(
  "game",
  {
    id_game: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    playerOne: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    playerTwo: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(),
      defaultValue: "Created",
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    winner: {
      type: DataTypes.STRING(),
      defaultValue: "none",
      allowNull: false,
    },
    turn: {
      type: DataTypes.STRING(),
      defaultValue: "current player",
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.STRING(),
      allowNull: true,
      defaultValue: "medium",
    },
    leaveState: {
      type: DataTypes.STRING(),
      defaultValue: "InProgress",
    },
  },
  {
    timestamps: false,
  }
);

/*
update game status in "In progress" when a new game is created
When playerOne creates the game, it is playerOne's turn
*/
Game.addHook("afterCreate", async (game: any, options) => {
  await game.update({ status: "In progress", turn: game.playerOne });
 
});




export async function getGame(idGame) {
  const game = await Game.findByPk(idGame);
  return game;
}

//find games between the two dates specified
export async function getGameByDateBetween(player, myFirstDate, mySecondDate) {
  let totalGames: any = [];
  await Game.findAll({
    where: {
      playerOne: player,
      startTime: { [Op.between]: [myFirstDate, mySecondDate] },
    },
  }).then((game: any) => {
    game.forEach((el) => totalGames.push(el));
  });

  await Game.findAll({
    where: {
      playerTwo: player,
      startTime: { [Op.between]: [myFirstDate, mySecondDate] },
    },
  }).then((game: any) => {
    game.forEach((el) => totalGames.push(el));
  });

  return totalGames;
}

//find games after a certain date
export async function getGameByDateGraterThan(player, myDate) {
  let totalGames: any = [];

  await Game.findAll({
    where: { playerOne: player, startTime: { [Op.gte]: myDate } },
  }).then((game: any) => {
    game.forEach((el) => totalGames.push(el));
  });

  await Game.findAll({
    where: { playerTwo: player, startTime: { [Op.gte]: myDate } },
  }).then((game: any) => {
    game.forEach((el) => totalGames.push(el));
  });

  return totalGames;
}

//find games before a certain date
export async function getGameByDateLessThan(player, myDate) {
  let totalGames: any = [];
  await Game.findAll({
    where: { playerOne: player, startTime: { [Op.lte]: myDate } },
  }).then((game: any) => {
    game.forEach((el) => totalGames.push(el));
  });

  await Game.findAll({
    where: { playerTwo: player, startTime: { [Op.lte]: myDate } },
  }).then((game: any) => {
    game.forEach((el) => totalGames.push(el));
  });

  return totalGames;
}

//find game's difficulty
export async function getDifficulty(idGame: any) {
  const game: any = await Game.findOne({
    where: { id_game: idGame },
    raw: true,
  });
  const difficulty: string = game.difficulty;
  return difficulty;
}

//update game's status 
export async function updateGameOver(idGame, status) {
  await Game.update(
    { status: status },
    {
      where: {
        id_game: idGame,
      },
    }
  );
}

export async function updateWinnerByNumber(idGame, winner: number) {
  let email: string = "";
  if (winner === 1) {
    email = await UserClass.findPlayerOneByGame(idGame);
  }
  if (winner === 2) {
    email = await UserClass.findPlayerTwoByGame(idGame);
  }
  await updateWinner(idGame, email);
  return email;
}

//update game's winner
export async function updateWinner(idGame, winnerEmail) {
  await Game.update(
    { winner: winnerEmail },
    {
      where: {
        id_game: idGame,
      },
    }
  );
}

//function that allows a player to make a draw request
//if both player has accepted draw, then game's status is updated in "Draw"
export async function leaveMatch(req: any, res: any) {

  let leaveState: string = "";

  const game: any = await getGame(req.body.id_game);
  leaveState = game.leaveState;

  const user1: string = await UserClass.findPlayerOneByGame(req.body.id_game);

  const user2: string = await UserClass.findPlayerTwoByGame(req.body.id_game);

  if (
    (req.user.email == user1 && leaveState == user2) ||
    (req.user.email == user2 && leaveState == user1)
  ) {
    await Game.update(
      {
        leaveState: "Leave",
        status: "Game Over",
        winner: "Draw",
      },
      {
        where: {
          id_game: req.body.id_game,
        },
      }
    );
    const msg: string = controllerSuccessMsg(SuccEnum.SuccessDraw, res);
    res.send(msg); 
  } else if (req.user.email == user1 && leaveState !== user2) {
    await Game.update(
      { leaveState: user1 },
      {
        where: {
          id_game: req.body.id_game,
        },
      }
    );
    const msg: string = controllerSuccessMsg(SuccEnum.SuccessDrawRequest, res);
    res.send(msg); 
  } else if (req.user.email == user2 && leaveState !== user1) {
    await Game.update(
      { leaveState: user2 },
      {
        where: {
          id_game: req.body.id_game,
        },
      }
    );
    const msg: string = controllerSuccessMsg(SuccEnum.SuccessDrawRequest, res);
    res.send(msg); 
  }
}

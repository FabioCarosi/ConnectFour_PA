import { DataTypes, Op, Sequelize } from "sequelize";
import { controllerSuccessMsg } from "../controller/controllerSuccessMessage";
import { SuccEnum } from "../Factory/SuccessFactory";
import * as strings from "../strings";
import { Singleton } from "./singletonDB";
import * as UserClass from "./user";

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
      defaultValue: strings.created,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    winner: {
      type: DataTypes.STRING(),
      defaultValue: strings.noWinner,
      allowNull: false,
    },
    turn: {
      type: DataTypes.STRING(),
      defaultValue: strings.currentPlayer,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.STRING(),
      allowNull: true,
      defaultValue: strings.medium,
    },
    leaveState: {
      type: DataTypes.STRING(),
      defaultValue: strings.inProgress,
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
  await game.update({ status: strings.inProgress, turn: game.playerOne });
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

export async function winnerByNumber(idGame, winner: number) {
  let email: string = "";
  if (winner === 1) {
    email = await UserClass.findPlayerOneByGame(idGame);
  }
  if (winner === 2) {
    email = await UserClass.findPlayerTwoByGame(idGame);
  }
  return email;
}

//function that allows a player to make a draw request
//if both player has accepted draw, then game's status is updated in "Draw"
export async function leaveMatch(req: any, res: any) {
  const game: any = await getGame(req.body.id_game);
  const leaveState = game.leaveState;

  const user1: string = await UserClass.findPlayerOneByGame(req.body.id_game);
  const user2: string = await UserClass.findPlayerTwoByGame(req.body.id_game);

  if (
    (req.user.email === user1 && leaveState === user2) || //if the other player has already requested abandonment
    (req.user.email === user2 && leaveState === user1) ||
    (req.user.email === user1 && user2 === strings.ai) //or if the second player is AI
  ) {
    await updateGameAttributes(
      //then modify the attributes of the game to end it
      req.body.id_game,
      strings.leaveGame,
      strings.leaveGame,
      strings.draw
    );
    const msg: string = controllerSuccessMsg(SuccEnum.SuccessDraw, res);
    res.send(msg);
  } else if (req.user.email == user1 && leaveState !== user2) {
    //if only the player one sent the request to abandon the game
    await updateGameAttributes(req.body.id_game, user1); //then save the request of the player one
    const msg: string = controllerSuccessMsg(SuccEnum.SuccessDrawRequest, res);
    res.send(msg);
  } else if (req.user.email == user2 && leaveState !== user1) {
    //if only the player two sent the request to abandon the game
    await updateGameAttributes(req.body.id_game, user2); //then save the request of the player two
    const msg: string = controllerSuccessMsg(SuccEnum.SuccessDrawRequest, res);
    res.send(msg);
  }
}

/*
function to update game attributes
@params: 
idGame = id of the game to update, 
leaveState: status of the draw request,
status: status of the game,
winner: email of winner user
*/
export async function updateGameAttributes(
  idGame: number,
  leaveState: string = strings.inProgress, //default = In Progress
  status: string = strings.inProgress, //default = In Progress
  winner: string = strings.noWinner //default = No Winner
) {
  Game.update(
    {
      leaveState: leaveState,
      status: status,
      winner: winner,
    },
    {
      where: {
        id_game: idGame,
      },
    }
  );
}

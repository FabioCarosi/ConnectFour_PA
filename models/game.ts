import { DataTypes, Model,Op, Sequelize } from "sequelize";
import { Singleton } from "./singletonDB";
import * as UserClass from "./user";
 
const connection: Sequelize = Singleton.getInstance();

export const Game = connection.define("game", {
    id_game: { 
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true},
    playerOne: {
        type: DataTypes.STRING(),
        allowNull: false
    },
    playerTwo: {
        type: DataTypes.STRING(),
        allowNull: false
    },
    status:{
        type: DataTypes.STRING(),
        defaultValue: "Created",
        allowNull: false
    },
    startTime: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    winner: {
        type: DataTypes.STRING(),
        defaultValue: "none",
        allowNull: false
    },
    turn: {
        type: DataTypes.STRING(),
        defaultValue: "current player",
        allowNull: false
    },
    difficulty: {
        type: DataTypes.STRING(),
        allowNull : true,
        defaultValue: "medium"
    },
    leaveState: {
      type: DataTypes.STRING(),
      defaultValue: "InProgress",
    }},
    {
        timestamps: false
    }
    
);

/*Game.belongsTo(User, {foreignKey: "playerOne",  targetKey: "email"});
Game.belongsTo(User, {foreignKey: "playerTwo",  targetKey: "email"});
Game.belongsTo(User, {foreignKey: "winner",  targetKey: "email"});


/*
update game status in "In progress" when a new game is created
When playerOne creates the game, it is playerOne's turn
*/
Game.addHook('afterCreate', async (game: any, options) => {
    await game.update({"status": "In progress", 
                        "turn": game.playerOne});
});


export async function getGame(idGame) {
    const game = await Game.findByPk(idGame);
    if (game === null) {
      console.log("Game not found!");
    } else {
      return game;
    }
  }

export async function getGameByDateBetween(player, myFirstDate, mySecondDate){
  let totalGames: any = [];
  await Game.findAll({
    where: {playerOne: player, startTime: {[Op.between]: [myFirstDate, mySecondDate] } }
  }).then( (game: any) => {
   game.forEach( el => totalGames.push(el));
  });

  await Game.findAll({
    where: {playerTwo: player, startTime: {[Op.between]: [myFirstDate, mySecondDate] } }
  }).then( (game: any) => {
    game.forEach( el => totalGames.push(el));
   });

  return totalGames;
};

//prende tutte le partite di un certo giocatore oltre una certa data
export async function getGameByDateGraterThan(player, myDate){
  let totalGames: any = [];
  
  await Game.findAll({
    where: {playerOne: player, startTime: {[Op.gte]: myDate } }
  }).then( (game: any) => {
    
   game.forEach( el => totalGames.push(el));
  });

  await Game.findAll({
    where: {playerTwo: player, startTime: {[Op.gte]: myDate } }
  }).then( (game: any) => {
    game.forEach( el => totalGames.push(el));
   });

  return totalGames;
}


//prende tutte le partite di un certo giocatore prima di una certa data
export async function getGameByDateLessThan(player, myDate){
  let totalGames: any = [];
  await Game.findAll({
    where: {playerOne: player, startTime: {[Op.lte]: myDate} }
  }).then( (game: any) => {
   game.forEach( el => totalGames.push(el));
  });

  await Game.findAll({
    where: {playerTwo: player, startTime: {[Op.lte]: myDate } }
  }).then( (game: any) => {
    game.forEach( el => totalGames.push(el));
   });

  return totalGames;
}


export async function getDifficulty(idGame: any){
    const difficulty = await Game.findOne({
  
        where: { id_game: idGame },
        attributes: ['difficulty'],
        raw: true,
    
      });
      
    return difficulty;
}

export async function updateGameOver(idGame) {
    await Game.update(
      { status: "Game Over" },
      {
        where: {
          id_game: idGame,
        },
      }
    );
  }

  export async function updateWinner(idGame, winner) {
    let email: string = "";
    if (winner == 1) {
      UserClass.findPlayerOneByGame(idGame).then((player: string) => {
        email = player;
        Game.update(
          { winner: email },
          {
            where: {
              id_game: idGame,
            },
          }
        );
      });
    } else if (winner == 2) {
      UserClass.findPlayerTwoByGame(idGame).then((player: string) => {
        email = player;
        Game.update(
          { winner: email },
          {
            where: {
              id_game: idGame,
            },
          }
        );
      });
    }
  }

  export async function leaveMatch(req: any, res: any) {
    let gameFound;
    let user1: string = "";
    let user2: string = "";
    let leaveState: string = "";
  
    console.log("Start getGame now");
  
    console.log(req.body.id_game);
  
    getGame(req.body.id_game).then((game) => {
      gameFound = game;
      leaveState = gameFound.leaveState;
      console.log(leaveState);
      console.log(req.user.email);
      UserClass.findPlayerOneByGame(req.body.id_game).then((userOne) => {
        user1 = userOne;
        console.log(user1);
        console.log(req.user.email);
  
        UserClass.findPlayerTwoByGame(req.body.id_game).then((userTwo) => {
          user2 = userTwo;
          console.log(user2);
          console.log(req.user.email);
  
          if (
            (req.user.email == user1 && leaveState == user2) ||
            (req.user.email == user2 && leaveState == user1)
          ) {
            console.log("primo if");
            Game.update(
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
            res.send("Game Over - Draw");
          } else if (req.user.email == user1 && leaveState !== user2) {
            console.log("secondo if");
            Game.update(
              { leaveState: user1 },
              {
                where: {
                  id_game: req.body.id_game,
                },
              }
            );
            res.send("Draw request saved");
          } else if (req.user.email == user2 && leaveState !== user1) {
            console.log("terzo if");
            console.log(req.user.email);
  
            Game.update(
              { leaveState: user2 },
              {
                where: {
                  id_game: req.body.id_game,
                },
              }
            );
            res.send("Draw request saved");
          } else {
            console.log("else");
            console.log(user1, user2, leaveState, req.user.email);
            res.send("Problem with draw request");
          }
        });
      });
    });
  }
import { DataTypes, Model, Sequelize } from "sequelize";
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
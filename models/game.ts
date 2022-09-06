import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "./singletonDB";
import { User } from "./user"
 
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
*/
Game.addHook('afterCreate', async (game: any, options) => {
    await game.update({"status": "In progress", "turn": game.playerOne});
});




export async function getDifficulty(idGame: any){
    const difficulty = await Game.findOne({
  
        where: { id_game: idGame },
        attributes: ['difficulty'],
        raw: true,
    
      });
      
    return difficulty;
}
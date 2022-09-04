import { DataTypes, Sequelize } from "sequelize";
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
        type: DataTypes.TINYINT(),
        allowNull: false
    }},
    {
        timestamps: false
    }
);

/*Game.belongsTo(User, {foreignKey: "playerOne",  targetKey: "email"});
Game.belongsTo(User, {foreignKey: "playerTwo",  targetKey: "email"});
Game.belongsTo(User, {foreignKey: "winner",  targetKey: "email"});

(async () => {
  await connection.sync({ force: true });
  // Code here
})();

/*
imposta stato a attivo quando viene creato un nuovo gioco
*/
/*
export async function changeState(req: any, res: any) {
    
}*/
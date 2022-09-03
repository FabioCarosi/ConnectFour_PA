import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "./singletonDB";
import { User } from "./user";
import { Game } from "./game";

const connection: Sequelize = Singleton.getInstance();

export const Move = connection.define("move", {
    id_move: { 
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true},
    id_game: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    email_user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    column: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    timestamp_move: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        allowNull: false
    }
});

Game.belongsTo(User, {foreignKey: "email_user",  targetKey: "email"});
Game.belongsTo(Game, {foreignKey: "id_game",  targetKey: "id_game"});


(async () => {
  await connection.sync({ force: true });
  // Code here
})();

/*
Restituisce tutte le mosse fatte in una certa partita passando come parametro il suo id 
*/
export async function findMovesbyGame(idGame: number){
    const allMoves = await Move.findAll({
        where: 
        { id_game: idGame }, raw: true
    }
    );

    return allMoves;
}
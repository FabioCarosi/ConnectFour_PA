import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "./singletonDB";
import * as UserClass from "./user";
import * as GameClass from "./game";

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
        type: DataTypes.STRING(),
        allowNull: false
    },
    column_move: {
        type: DataTypes.TINYINT(),
        allowNull: false
    },
    timestamp_move: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }},
    {
        timestamps: false
    }
);

/*Game.belongsTo(User, {foreignKey: "email_user",  targetKey: "email"});
Game.belongsTo(Game, {foreignKey: "id_game",  targetKey: "id_game"});*/




/*
Restituisce tutte le mosse fatte in una certa partita passando come parametro il suo id 
*/
export async function findMovesbyGame(idGame: any){
    const allMoves= await Move.findAll({
        where: 
        { id_game: idGame }, 
        //attributes: ['column_move'],
        raw: true
    }
    );

    return allMoves;
}
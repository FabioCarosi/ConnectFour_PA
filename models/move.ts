import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "./singletonDB";
import { User } from "./user";
import { Game } from "./game";

const connection: Sequelize = Singleton.getConnection();

const Move = connection.define("move", {
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


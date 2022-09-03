import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "./singletonDB";

const connection: Sequelize = Singleton.getInstance();

export const User = connection.define("user", {
    email: { 
    type: DataTypes.STRING,
    primaryKey: true
    },
    credit:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

(async () => {
  await connection.sync({ force: true });
  // Code here
})();

//funzione asincrona che aggiorna il credito dell'utente
require('dotenv').config();
import { Sequelize } from "sequelize/types";


export class Singleton {

    private static instance: Singleton;
    private connection: Sequelize;

    private constructor(){
        this.connection = new Sequelize(process.env.MYSQL_DATABASE!, process.env.MYSQL_USER!, process.env.MYSQL_PASSWORD,{
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            dialect: 'mysql'
        });
    }

    public static getConnection():Sequelize {
        if(!Singleton.instance){
            Singleton.instance = new Singleton();
        }

        return Singleton.instance.connection;
    }

}
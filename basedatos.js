import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('casos_criminales_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});
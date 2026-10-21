import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('casos_criminales_db', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});
import { DataTypes } from 'sequelize';
import { sequelize } from '../basedatos.js';

export const zona = sequelize.define('zona', {
  codZona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});
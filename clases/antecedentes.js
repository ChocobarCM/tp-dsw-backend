import { DataTypes } from 'sequelize';
import { sequelize } from '../basedatos.js';

export const antecedentes = sequelize.define('antecedentes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaInicial: { 
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT, 
    allowNull: false
  },
  condena: {
    type: DataTypes.TEXT, 
    allowNull: true 
  }
}, {
  timestamps: true
});
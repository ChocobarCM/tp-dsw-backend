import { DataTypes } from 'sequelize';
import { sequelize } from '../basedatos.js';

export const fiscalia = sequelize.define('fiscalia', {
  idFiscalia: {
type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true    
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true 
});
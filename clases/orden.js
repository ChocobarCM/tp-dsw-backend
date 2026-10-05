import { DataTypes } from 'sequelize';
import { sequelize } from '../basedatos.js';

export const orden = sequelize.define('orden', {
  idOrden: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nroRegistroLegal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipoOrden: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaSolicitud: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaAdmision: {
    type: DataTypes.DATE,
    allowNull: false
  },
  
  estadoOrden: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true 
});
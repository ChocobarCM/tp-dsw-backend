import { DataTypes } from 'sequelize';
import { sequelize } from '../basedatos.js';

export const auditoria = sequelize.define('auditoria', {
  idAuditoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  accion: { type: DataTypes.STRING, allowNull: false },
  estadoAnterior: { type: DataTypes.STRING, allowNull: true },
  estadoNuevo: { type: DataTypes.STRING, allowNull: false },
  dniUsuario: { type: DataTypes.INTEGER, allowNull: false }
}, {
  timestamps: true,
  tableName: 'auditoria_casos'
});
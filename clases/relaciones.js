import { zona } from './zona.js';
import { usuarios } from './usuarios.js'
import { tipoDelito } from './tipoDelitos.js';
import { pruebas } from './pruebas.js'
import { orden } from './orden.js'
import { fiscalia } from './fiscalia.js'
import { casos } from './casos.js';
import { criminales } from './criminales.js'; 
import { antecedentes } from './antecedentes.js';
import { auditoria } from './auditoria.js';


export function configurarRelaciones() {
  // --- RELACIONES DE CASOS ---
  // Relaciones de 1 a N :V 
  zona.hasMany(casos, { foreignKey: 'zonaCodZona' });
  casos.belongsTo(zona, { foreignKey: 'zonaCodZona' });

  fiscalia.hasMany(orden);
  orden.belongsTo(fiscalia);
  casos.hasMany(orden, { foreignKey: 'casoIdCasos' });
  orden.belongsTo(casos, { foreignKey: 'casoIdCasos' });

  casos.hasMany(pruebas);
  pruebas.belongsTo(casos);



  casos.hasMany(auditoria, { foreignKey: 'codCaso' });
  auditoria.belongsTo(casos, { foreignKey: 'codCaso' });
  
  tipoDelito.hasMany(casos, { foreignKey: 'tipoDelitoId' });
  casos.belongsTo(tipoDelito, { foreignKey: 'tipoDelitoId' });

    usuarios.hasMany(casos, {foreignKey: 'codDetective', });
    casos.belongsTo(usuarios, {foreignKey: 'codDetective',as: 'detective',allowNull: true });

  // Relaciones de 1 a 1 Prioridades cheñor
  zona.hasOne(fiscalia);
  fiscalia.belongsTo(zona);

  // Relaciones de N a M
    usuarios.belongsToMany(pruebas, { through: 'Forenses_Pruebas' });
    pruebas.belongsToMany(usuarios, { through: 'Forenses_Pruebas' });



  criminales.hasMany(antecedentes, { 
    foreignKey: { allowNull: false },
    onDelete: 'CASCADE' 
  });
  antecedentes.belongsTo(criminales);
}
import { zona } from './zona.js';
import { usuarios } from './usuarios.js'
import { tipoDelito } from './tipoDelitos.js';
import { pruebas } from './pruebas.js'
import { orden } from './orden.js'
import { fiscalia } from './fiscalia.js'
import { casos } from './casos.js';
import { criminales } from './criminales.js'; 
import { antecedentes } from './antecedentes.js';


export function configurarRelaciones() {
  // --- RELACIONES DE CASOS ---
  // Relaciones de 1 a N :V 
  zona.hasMany(casos);
  casos.belongsTo(zona);

  fiscalia.hasMany(orden);
  orden.belongsTo(fiscalia);

  casos.hasMany(pruebas);
  pruebas.belongsTo(casos);
  
  tipoDelito.hasMany(casos)
  casos.belongsTo(tipoDelito)

  // Relaciones de 1 a 1 Prioridades cheñor
  zona.hasOne(fiscalia);
  fiscalia.belongsTo(zona);

  // Relaciones de N a M 
    usuarios.belongsToMany(casos, { through: 'Detectives_Casos' });
    casos.belongsToMany(usuarios, { through: 'Detectives_Casos' });

    usuarios.belongsToMany(pruebas, { through: 'Forenses_Pruebas' });
    pruebas.belongsToMany(usuarios, { through: 'Forenses_Pruebas' });



  criminales.hasMany(antecedentes, { 
    foreignKey: { allowNull: false },
    onDelete: 'CASCADE' 
  });
  antecedentes.belongsTo(criminales);
}
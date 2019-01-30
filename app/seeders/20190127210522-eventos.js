'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
      /*
        Agregando Eventos
      */
      return queryInterface.bulkInsert('TipoEventos', [
        { descripcion: "Presencial" },
        { descripcion: "Virtual" }
      ], {});
    },

      down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('TipoEventos', null, {});
      }
    };

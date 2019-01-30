'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Agregando Categorias
    */
    return queryInterface.bulkInsert('Categorias', [
    { descripcion: "Conferencia" },
    { descripcion: "Seminario" },
    { descripcion: "Congreso" },
    { descripcion: "Curso" }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categorias', null, {});
  }
};

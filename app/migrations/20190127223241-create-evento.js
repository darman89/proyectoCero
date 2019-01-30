'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Eventos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_autor: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING
      },
      id_categoria:  {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Categorias',
          key: 'id'
        }
      },
      lugar: {
        allowNull: false,
        type: Sequelize.STRING
      },
      direccion: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fecha_inicio: {
        allowNull: false,
        type: Sequelize.DATE
      },
      fecha_fin: {
        allowNull: false,
        type: Sequelize.DATE
      },
      id_tipoevento: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'TipoEventos',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Eventos');
  }
};
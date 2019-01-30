'use strict';
module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categorias', {
    descripcion: DataTypes.STRING
  }, {
    timestamps: false
  });
  Categoria.associate = function(models) {
    // associations can be defined here
  };
  return Categoria;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const TipoEvento = sequelize.define('TipoEvento', {
    descripcion: DataTypes.STRING
  }, {
    timestamps: false
  });
  TipoEvento.associate = function(models) {
    // associations can be defined here
  };
  return TipoEvento;
};
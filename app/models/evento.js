'use strict';
module.exports = (sequelize, DataTypes) => {
  const Evento = sequelize.define('Evento', {
    id_autor: DataTypes.STRING,
    nombre: DataTypes.STRING,
    id_categoria: DataTypes.INTEGER,
    lugar: DataTypes.STRING,
    direccion: DataTypes.STRING,
    fecha_inicio: DataTypes.DATE,
    fecha_fin: DataTypes.DATE,
    id_tipoevento: DataTypes.INTEGER
  }, {});
  Evento.associate = function(models) {
    // associations can be defined here
    Evento.belongsTo(models.Categorias, {foreignKey: 'id_categoria', targetKey: 'id', as: 'categoria'});
    Evento.belongsTo(models.TipoEvento, {foreignKey: 'id_tipoevento', targetKey: 'id', as: 'tipoevento'});
  };
  return Evento;
};
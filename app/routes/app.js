const async = require("async");
const express = require("express");
const okta = require("@okta/okta-sdk-nodejs");
const moment = require('moment');
const modelos = require("../models");

const router = express.Router();

// Only let the user access the route if they are authenticated.
function ensureAuthenticated(req, res, next) {
  if (!req.userContext) {
    res.redirect('/login')
    //return res.status(401).render("unauthenticated");
  }

  next();
}

// Página Principal
router.get("/", (req, res) => {
  res.redirect('eventos');
});

// Listar Eventos por Usuario (Datatable)
router.get("/eventos/list", ensureAuthenticated, (req, res) => {
  modelos.Evento.findAll({
    order: [['id', 'DESC']],
    attributes: ['id', 'nombre', 'lugar', 'direccion', 'fecha_inicio', 'fecha_fin'],
    where: {
      id_autor: req.userContext.userinfo.sub
    },
    include: ['categoria', 'tipoevento']
  }).then(eventos => {
    let eventosData = [];
    async.eachSeries(eventos, (evento, callback) => {
      evento = evento.get({ plain: true });
      eventosData.push({
        f0: evento.nombre,
        f1: evento.lugar,
        f2: moment(evento.fecha_inicio).format('DD/MM/YYYY hh:mm A'),
        f3: moment(evento.fecha_fin).format('DD/MM/YYYY hh:mm A'),
        f4: req.protocol + '://' + req.get('host') + '/eventos/'+evento.id
      });
      callback();
    }, err => {
      return res.send(eventosData);
    });
  });
});

// Cargar Vista de Eventos
router.get("/eventos", ensureAuthenticated, (req, res) => {
  return res.render("eventos", {user: req.userContext});
});

// Cargar Vista de eliminación de Eventos
router.get("/eventos/eliminar", ensureAuthenticated, (req, res) => {
  return res.render("eliminar");
});

// Cargar Vista de creación de Eventos
router.get("/eventos/crear", ensureAuthenticated, (req, res) => {
  return res.render("creacion");
});

// Generar detalle del Evento
function getEvento(idEvento, idUsuario, callback){
  modelos.Evento.findOne({
    where: {
      id: idEvento,
      id_autor: idUsuario
    },
    include: ['categoria', 'tipoevento']
  }).then(evento => {
    if (!evento) {
      return res.status(400).json({ error: 'No se ha encontrado el evento en la base de datos!' })
    }

    evento = evento.get({ plain: true });
    let eventoData;
    eventoData = {
        nombre: evento.nombre,
        lugar: evento.lugar,
        dir: evento.direccion,
        id_categoria: evento.categoria.id,
        categoria: evento.categoria.descripcion,
        id_evento: evento.tipoevento.id,
        tipo: evento.tipoevento.descripcion,
        fi: moment(evento.fecha_inicio).format('DD/MM/YYYY hh:mm A'),
        ff: moment(evento.fecha_fin).format('DD/MM/YYYY hh:mm A'),
    };

    callback(eventoData);
});

}

// Cargar Detalles de Eventos
router.get("/eventos/:id/info", ensureAuthenticated, (req, res) => {
  getEvento(req.params.id, req.userContext.userinfo.sub, function(evento){
    return res.send(evento);
  });
});

// Cargar Vista de actualización de Eventos
router.get("/eventos/:id/actualizar", ensureAuthenticated, (req, res) => {
  return res.render("actualizacion", {uri: req.protocol + '://' + req.get('host') + '/eventos/'+req.params.id});
});

// Cargar Vista Detalles de Eventos
router.get("/eventos/:id/detalles", ensureAuthenticated, (req, res) => {
  getEvento(req.params.id, req.userContext.userinfo.sub, function(evento){
    return res.render("detalles", { detalle:  evento})
  });
});

// Guardar Eventos
router.post("/eventos/crear", ensureAuthenticated, (req, res) => {
  modelos.Evento.create({
    id_autor: req.userContext.userinfo.sub,
    nombre: req.body.nombre,
    id_categoria: req.body.categoria,
    lugar: req.body.lugar,
    direccion: req.body.direccion,
    fecha_inicio: req.body.finicio,
    fecha_fin: req.body.ffinal,
    id_tipoevento: req.body.modalidad
  }).then(newEvento => {
    if (newEvento.id > 0) {
      return res.send({ message: 'El evento ha sido creado!' });
    }else{
      return res.status(400).json({ error: 'No se ha podido crear el evento!' })
    }
  });
});

// Actualizar Eventos
router.put("/eventos/:id/actualizar", ensureAuthenticated, (req, res) => {
  modelos.Evento.findOne({
    where: {
      id: req.params.id,
      id_autor: req.userContext.userinfo.sub
    }
  }).then(evento => {

    if (!evento) {
      return res.status(400).json({ error: 'No se ha podido actualizar el evento!' })
    }

    evento.update({
    nombre: req.body.nombre,
    id_categoria: req.body.categoria,
    lugar: req.body.lugar,
    direccion: req.body.direccion,
    fecha_inicio: req.body.finicio,
    fecha_fin: req.body.ffinal,
    id_tipoevento: req.body.modalidad
    }).then(() => {
      return res.send({ message: 'El evento ha sido actualizado con éxito!' });
    });

  });

});

// Eliminar Evento
router.delete("/eventos/:id", ensureAuthenticated, (req, res) => {
  //return res.send(req.params.id);
  modelos.Evento.findOne({
    where: {
      id: req.params.id,
      id_autor: req.userContext.userinfo.sub
    }
  }).then(evento => {
    
    if (!evento) {
      return res.status(400).json({ error: 'No se ha encontrado el evento en la base de datos!' })
    }

    evento.destroy().then(rowDeleted => {
      return res.send({ message: 'El evento ha sido eliminado!' });
    }, function(err){
      return res.status(400).json({ error: 'No se ha podido eliminar el evento!' })
    });
    
});
});

module.exports = router;
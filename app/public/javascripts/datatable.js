$(document).ready(function() {
    var modal_delete, nombre_evento, container = $('#containerModal');
    var table = $('#events-table').DataTable({
        ajax: {
            url: '/eventos/list',
            dataSrc: function (json) {
                return json;
            }
        },
        order: false,
        columns: [
            {data: 'f0'},
            {data: 'f1'},
            {data: 'f2'},
            {data: 'f3'},
            {data: 'f4'}
        ],
        iDisplayLength: 4,
        select: {
            info: true,
            style: 'single'
        },
        dom: 'Bfrtip',
        autoWidth: false,
        buttons: [
            {
                className: 'btn btn-sm btn-success',
                text: '<span class="bold">Crear Evento</span>',
                action: function (e, dt) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    table.rows('.selected').deselect();
                    $.ajax({
                        url: window.location.origin + '/eventos/crear',
                        type: 'GET',
                        success: function(result) {
                            
                            $.when(container.html(result)).then(function(){
                                $('#crearModal').modal('show', true);
                            });
                            
                        }
                    });
                }
            },
            {
                extend: 'selected',
                className: 'btn btn-sm btn-info',
                text: '<span class="bold">Ver Detalles</span>',
                action: function (e, dt) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    var row = dt.rows({selected: true}).data()[0];
                    $.ajax({
                        url: row.f4 + '/detalles',
                        type: 'GET',
                        success: function(result) {
                            
                            $.when(container.html(result)).then(function(){
                                $('#detallesModal').modal('show', true);
                            });
                            
                        }
                    });
                }
            },
            {
                extend: 'selected',
                className: 'btn btn-sm btn-warning',
                text: '<span class="bold">Editar Evento</span>',
                action: function (e, dt) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    var row = dt.rows({selected: true}).data()[0];
                    $.ajax({
                        url: row.f4 + '/actualizar',
                        type: 'GET',
                        success: function(result) {
                            
                            $.when(container.html(result)).then(function(){
                                $('#actualizarModal').modal('show', true);
                            });
                            
                        }
                    });
                }
            },
            {
                extend: 'selected',
                className: 'btn btn-sm btn-danger',
                text: '<span class="bold">Eliminar Evento</span>',
                action: function (e, dt) {
                    e.stopImmediatePropagation();
                    e.preventDefault();

                    $.ajax({
                        url: window.location.origin + '/eventos/eliminar',
                        type: 'GET',
                        success: function(result) {
                            $.when(container.html(result)).then(function(){
                                var row = dt.rows({selected: true}).data()[0];
                                modal_delete = $('#deleteModal');
                                nombre_evento = $('#nombre_evento');
                                nombre_evento.html('<strong>'+row.f0+'</strong>');
                                modal_delete.modal('show', true);
                            });
                            
                        }
                    });
                   
                    
                }
            }
        ],
        language: {
            loadingRecords: 'Cargando...',
            zeroRecords: 'No se encontraron resultados',
            infoFiltered: '(filtrado de un total de _MAX_ registros) ',
            lengthMenu: "Mostrar _MENU_ entradas",
            search: "Buscar:",
            infoEmpty: '0 registros. ',
            emptyTable: 'No hay eventos registrados',
            info: '<b>_START_ a _END_</b> de _TOTAL_ registros. ',
            "paginate": {
                "first":      "Inicio",
                "last":       "Fin",
                "next":       "Siguiente",
                "previous":   "Anterior"
            },
            select: {
                rows: {
                    _: "",
                    1: "1 fila seleccionada"
                }
            }
        },
        columnDefs: [
            {
                'targets': [0],
                'width': "25%",
                'searchable': true,
                'class': "text-left"
            },
            {
                'targets': [1],
                'width': "35%",
                'searchable': true,
                'class': "text-left"
            },
            {
                'targets': [4],
                'visible': false,
                'searchable': false,
                'class': "text-center small"
            },
            {
                'targets': [2, 3],
                'width': "20%",
                'searchable': true,
                'class': "text-center"
            }
        ],
    });

    container.on('click', '#eliminar_evento', function(e){
        var row = table.rows({selected: true}).data()[0];
        container.find('#eliminar_evento').prop('disabled', true);
        $.ajax({
            url: row.f4,
            type: 'DELETE',
            success: function(result) {
                table.ajax.reload();
                container.find('.modal-body').html('<div class="alert alert-success">'+result.message+'</div>');
                container.find('#cancelar').html('Cerrar');
                container.find('#eliminar_evento').hide('slow');
                container.find('#eliminar_evento').prop('disabled', true);
            },
            error: function(result){
                container.find('.error_server').hide('slow').remove();
                container.find('.modal-body').append('<div class="alert alert-danger error_server">'+result.responseJSON.error+'</div>');
                container.find('#eliminar_evento').prop('disabled', false);
            }
        });
        
    });

} );
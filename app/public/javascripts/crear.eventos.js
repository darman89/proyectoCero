$(document).ready(function () {
    var form = $('#crear_evento'), container = $('#containerModal');
    
    $('.daterangepicker').remove();
    $('input[name="fecha"]').daterangepicker({
        timePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(24, 'hour'),
        opens: "center",
        locale: {
            "format": 'DD/MM/YYYY hh:mm A',
            "cancelLabel": 'Cancelar',
            "applyLabel": 'Aplicar',
            "fromLabel": "Desde",
            "toLabel": "Hasta",
            "customRangeLabel": "Personalizado",
            "weekLabel": "S",
            "daysOfWeek": [
                "Do",
                "Lu",
                "Ma",
                "Mi",
                "Ju",
                "Vi",
                "Sa"
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Deciembre"
            ],
            "firstDay": 1
        }
    });

    // Objeto Validador
    form.validate({
        errorClass: "text-danger",
        onfocusout: false,
        invalidHandler: function (e, validator) {
            if (validator.errorList.length > 0) {
                validator.errorList[0].element.focus();
                validator.showErrors();
            }
        },
        submitHandler: function() {
            var drp = $('input[name="fecha"]').data('daterangepicker');
            
            $.ajax({
                url: window.location.origin + '/eventos/crear',
                contentType:'application/x-www-form-urlencoded; charset=UTF-8',
                type: 'POST',
                data: {nombre: $('#nombre').val(), finicio: drp.startDate.toISOString(), ffinal: drp.endDate.toISOString(), direccion: $('#direccion').val(), lugar: $('#lugar').val(), categoria: $('#categoria').val(), modalidad: $('#modalidad').val() },
                success: function(result) {
                    $('#events-table').DataTable().ajax.reload();
                    container.find('.modal-dialog').removeClass('modal-lg');
                    container.find('.modal-body').html('<div class="alert alert-success">'+result.message+'</div>');
                    container.find('#cancelar').html('Cerrar');
                    container.find('#crearevento').hide('slow');
                    container.find('#crearevento').prop('disabled', true);               
                },
                error: function(result) {
                    container.find('.error_server').hide('slow').remove();
                    container.find('.modal-body').append('<div class="alert alert-danger error_server">'+result.responseJSON.error+'</div>');
                    container.find('#crearevento').prop('disabled', false);
                }
            });
        }
    });


});
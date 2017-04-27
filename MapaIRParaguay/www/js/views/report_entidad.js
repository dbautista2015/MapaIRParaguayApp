(function (FMS, Backbone, _, $) {
    _.extend(FMS, {
        ReportEntidadView: FMS.FMSView.extend({
            template: 'report_entidad',
            id: 'report_entidad-page',
            prev: 'login',

            events: {
                'pagehide': 'destroy',
                'pagebeforeshow': 'beforeDisplay',
                'pageshow': 'afterDisplay',
                'vclick .ui-btn-left': 'onClickButtonPrev',
                'vclick .ui-btn-right': 'onClickButtonNext',
                'vclick #buscarReporte': 'buscarReporte'
            },

            afterDisplay: function () {
                $('#nombreEntidad').html('Bienvenido ' + FMS.Body);
                //this.listenTo(FMS.locator, 'search_located', this.searchSuccess);
                //this.listenTo(FMS.locator, 'search_failed', this.searchFail);
                //FMS.locator.lookup(FMS.body);
            },
            _back: function () {
                navigator.app.exitApp();
            },

            setHeight: function (content, height) {
                content.css('min-height', content + 'px');
            },
            buscarReporte: function (e) {
                e.preventDefault();
                $('#pcEntidad').focus();
                FMS.allClosedReportEntidad = new FMS.Drafts();
                if ($('#pcEntidad').val() == undefined || $('#pcEntidad').val() == "") FMS.allClosedReportEntidad = FMS.allReporteRegalias;
                else
                {
                    for (i = 0; i < FMS.allReporteRegalias.length; i++) {
                        if (FMS.allReporteRegalias.models[i].attributes.codigoEntidad.toUpperCase().indexOf($('#pcEntidad').val().toUpperCase()) > 0 || FMS.allReporteRegalias.models[i].attributes.codigoProyecto.toUpperCase().indexOf($('#pcEntidad').val().toUpperCase()) > 0 || FMS.allReporteRegalias.models[i].attributes.nombreEntidad.toUpperCase().indexOf($('#pcEntidad').val().toUpperCase()) > 0 || FMS.allReporteRegalias.models[i].attributes.nombreProyecto.toUpperCase().indexOf($('#pcEntidad').val().toUpperCase()) > 0)
                            FMS.allClosedReportEntidad.add(FMS.allReporteRegalias.models[i]);
                    }
                }
                this.navigate('ver_report_entidad');
            },
            validate: function () {
                this.clearValidationErrors();
                var isValid = 1;
                if (!$('#pcEntidad').val()) {
                    isValid = 0;
                    this.validationError('pcEntidad', FMS.validationStrings.search);
                }
                if (!isValid) {
                    // this makes sure the onscreen keyboard is dismissed
                    $('#pcEntidad').focus();
                }
                return isValid;
            },
            
        })
    });
})(FMS, Backbone, _, $);
(function (FMS, Backbone, _, $) {
    _.extend(FMS, {
        DetailsGestionEntidadView: FMS.FMSView.extend({
            template: 'details_gestion_entidad',
            id: 'details_gestion_entidad-page',
            prev: 'details_report_entidad',
            bottomMargin: -20,

            events: {
                'pagehide': 'destroy',
                'pagebeforeshow': 'beforeDisplay',
                'pageshow': 'afterDisplay',
                'vclick .ui-btn-left': 'onClickButtonPrev',
                'vclick .ui-btn-right': 'onClickButtonNext',
                'vclick #confirmarGestion':'onClickConfirmar'
              
            },
            afterDisplay: function ()
            {
                var estados = '<select id="estados"><option value="confirmed">Abierto</option><option value="investigating">Investigando</option><option value="action scheduled">Acción programada</option><option value="in progress">Procesando</option><option value="duplicate">Duplicado</option><option value="unable to fix">No es posible solucionar</option><option value="not responsible">No es responsable</option><option value="fixed">Arreglado</option></select>';
                if (FMS.currentDraftEntidad.attributes.category == 'fixed - council')
                    estados = '<select id="estados"><option value="fixed - council">Arreglado ente territorial</option><option value="fixed">Arreglado</option><option value="confirmed">Abierto</option><option value="investigating">Investigando</option><option value="action scheduled">Acción programada</option><option value="in progress">Procesando</option><option value="duplicate">Duplicado</option><option value="unable to fix">No es posible solucionar</option><option value="not responsible">No es responsable</option></select>';
                if (FMS.currentDraftEntidad.attributes.category == 'fixed')
                    estados = '<select id="estados"><option value="fixed">Arreglado</option><option value="confirmed">Abierto</option><option value="investigating">Investigando</option><option value="action scheduled">Acción programada</option><option value="in progress">Procesando</option><option value="duplicate">Duplicado</option><option value="unable to fix">No es posible solucionar</option><option value="not responsible">No es responsable</option><option value="fixed - council">Arreglado ente territorial</option></select>';
                if (FMS.currentDraftEntidad.attributes.category == 'investigating')
                    estados = '<select id="estados"><option value="investigating">Investigando</option><option value="fixed">Arreglado</option><option value="confirmed">Abierto</option><option value="action scheduled">Acción programada</option><option value="in progress">Procesando</option><option value="duplicate">Duplicado</option><option value="unable to fix">No es posible solucionar</option><option value="not responsible">No es responsable</option><option value="fixed - council">Arreglado ente territorial</option></select>';
                if (FMS.currentDraftEntidad.attributes.category == 'action scheduled')
                    estados = '<select id="estados"><option value="action scheduled">Acción programada</option><option value="in progress">Procesando</option><option value="investigating">Investigando</option><option value="fixed">Arreglado</option><option value="confirmed">Abierto</option><option value="duplicate">Duplicado</option><option value="unable to fix">No es posible solucionar</option><option value="not responsible">No es responsable</option><option value="fixed - council">Arreglado ente territorial</option></select>';
                if (FMS.currentDraftEntidad.attributes.category == 'hidden')
                    estados = '<select id="estados"><option value="hidden">Oculto</option><option value="investigating">Investigando</option><option value="fixed">Arreglado</option><option value="confirmed">Abierto</option><option value="action scheduled">Acción programada</option><option value="duplicate">Duplicado</option><option value="unable to fix">No es posible solucionar</option><option value="not responsible">No es responsable</option><option value="fixed - council">Arreglado ente territorial</option></select>';
                if (FMS.currentDraftEntidad.attributes.category == 'fixed - user')
                    estados = '<select id="estados"><option value="fixed - user">Cerrado por el usuario</option><option value="action scheduled">Acción programada</option><option value="in progress">Procesando</option><option value="investigating">Investigando</option><option value="fixed">Arreglado</option><option value="confirmed">Abierto</option><option value="unable to fix">No es posible solucionar</option><option value="not responsible">No es responsable</option><option value="fixed - council">Arreglado ente territorial</option></select>';
                if (FMS.currentDraftEntidad.attributes.category == 'unable to fix')
                    estados = '<select id="estados"><option value="unable to fix">No es posible solucionar</option><option value="duplicate">Duplicado</option><option value="action scheduled">Acción programada</option><option value="in progress">Procesando</option><option value="investigating">Investigando</option><option value="fixed">Arreglado</option><option value="confirmed">Abierto</option><option value="not responsible">No es responsable</option><option value="fixed - council">Arreglado ente territorial</option></select>';
                if (FMS.currentDraftEntidad.attributes.category == 'not responsible')
                    estados = '<select id="estados"><option value="not responsible">No es responsable</option><option value="unable to fix">No es posible solucionar</option><option value="duplicate">Duplicado</option><option value="action scheduled">Acción programada</option><option value="in progress">Procesando</option><option value="investigating">Investigando</option><option value="fixed">Arreglado</option><option value="confirmed">Abierto</option><option value="fixed - council">Arreglado ente territorial</option></select>';
                if (FMS.currentDraftEntidad.attributes.category == 'unconfirmed')
                    estados = '<select id="estados"><option value="unconfirmed">Sin confirmar</option><option value="not responsible">No es responsable</option><option value="unable to fix">No es posible solucionar</option><option value="duplicate">Duplicado</option><option value="action scheduled">Acción programada</option><option value="in progress">Procesando</option><option value="investigating">Investigando</option><option value="fixed">Arreglado</option><option value="confirmed">Abierto</option><option value="fixed - council">Arreglado ente territorial</option></select>';
                $('#divEstados').html(estados);
            },

            onClickButtonPrev: function (e) {
                e.preventDefault();
                this.updateCurrentReport();
                this.navigate(this.prev, true);
            },

            onClickButtonNext: function (e) {
                e.preventDefault();
                // dismiss on screen keyboard
                $('.ui-btn-right').focus();
                this.clearValidationErrors();
                var valid = 1;

                if (!$('#form_title').val()) {
                    valid = 0;
                    this.validationError('form_title', FMS.validationStrings.title);
                }

                if (!$('#form_detail').val()) {
                    valid = 0;
                    this.validationError('form_detail', FMS.validationStrings.detail);
                }

                var cat = $('#form_category').val();
                if (cat == '-- Pick a category --') {
                    valid = 0;
                    this.validationError('form_category', FMS.validationStrings.category);
                }

                if (valid) {
                    this.clearValidationErrors();
                    this.updateCurrentReport();
                    if (FMS.isOffline) {
                        this.navigate('save_offline');
                    } else {
                        var that = this;
                        $.ajax({
                            url: CONFIG.FMS_URL + '/report/new/category_extras',
                            type: 'POST',
                            data: {
                                category: this.model.get('category'),
                                latitude: this.model.get('lat'),
                                longitude: this.model.get('lon')
                            },
                            dataType: 'json',
                            timeout: 30000,
                            success: function (data, status) {
                                if (data && data.category_extra && data.category_extra.length > 0) {
                                    that.model.set('category_extras', data.category_extra);
                                    that.navigate('details_extra');
                                } else {
                                    that.navigate(that.next);
                                }
                            },
                            error: function () {
                                that.displayAlert(FMS.strings.category_extra_check_error);
                            }
                        });
                    }
                }
            },

            validationError: function (id, error) {
                var el_id = '#' + id;
                var el = $(el_id);

                el.addClass('error');
                if (el.val() === '') {
                    el.attr('orig-placeholder', el.attr('placeholder'));
                    el.attr('placeholder', error);
                }
            },

            clearValidationErrors: function () {
                $('.error').removeClass('error');
                $('.error').each(function (el) { if (el.attr('orig-placeholder')) { el.attr('placeholder', el.attr('orig-placeholder')); } });
            },

            setSelectClass: function () {
                var cat = this.$('#form_category');
                if (cat.val() !== "" && cat.val() !== '-- Pick a category --') {
                    cat.removeClass('noselection');
                } else {
                    cat.addClass('noselection');
                }
            },

            updateSelect: function () {
                this.updateCurrentReport();
                this.setSelectClass();
            },

            updateCurrentReport: function () {
                var category = $('#form_category').val();
                if (category === '-- Pick a category --') {
                    category = '';
                }
                if (category && $('#form_title').val() && $('#form_detail').val()) {
                    $('#next').addClass('page_complete_btn');
                } else {
                    $('#next').removeClass('page_complete_btn');
                }
                this.model.set('category', category);
                this.model.set('title', $('#form_title').val());
                this.model.set('details', $('#form_detail').val());
                FMS.saveCurrentDraft();
            },

            onClickConfirmar: function (e) {
                e.preventDefault();
                //se debe guardar el reporte y redireccionar de nuevo al login.
                
                if (FMS.isOffline) {
                    this.navigate('save_offline');
                } else {
                    var that = this;
                    $.ajax({
                        url: CONFIG.FMS_URL + '/report/update/mobile',
                        type: 'POST',
                        data: {
                            id: FMS.currentDraftEntidad.id,
                            update: $('#form_detail_gestion').val(),
                            name: FMS.currentUser.get('name'),
                            fixed: 0,
                            state: $('#estados').val(),
                            reopen: 0,
                            rznvy: FMS.currentUser.get('email')
                         },
                        dataType: 'json',
                        timeout: 30000,
                        success: function (data, status)
                        {
                            that.displayAlert('Los datos se guardaron exitosamente');
                            $('#form_detail_gestion').val('');
                            that.navigate('details_entidad');
                        },
                        error: function () {
                            that.displayAlert(FMS.strings.category_extra_check_error);
                        }
                    });
                }
            },
        })
    });
})(FMS, Backbone, _, $);

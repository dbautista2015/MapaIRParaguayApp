(function (FMS, Backbone, _, $) {
    _.extend( FMS, {
        LoginView: FMS.FMSView.extend({
            template: 'login',
            id: 'login',
            next: 'around',
            prev: 'around',

            events: {
                'pagehide': 'destroy',
                'pagebeforeshow': 'beforeDisplay',
                'pageshow': 'afterDisplay',
                'vclick #login': 'onClickLogin',
                'submit #signinForm': 'onClickLogin',
                'vclick #logout': 'onClickLogout',
                'vclick .ui-btn-left': 'onClickButtonPrev',
                'vclick .ui-btn-right': 'onClickButtonNext',
                'vclick #buscarproyectos': 'onClickProyectos'
            },

            afterDisplay: function () {
                if (FMS.isOffline)
                {
                    $('#locating').hide();
                    this.navigate('offline');
                }
                //else if (FMS.isLoggedIn && FMS.currentUser !== null && FMS.currentUser.get('body') !== undefined)
                //{
                //    var that = this;
                //    that.model.set('password', FMS.currentUser.get('password'));
                //    that.model.set('email', FMS.currentUser.get('email'));
                //    that.model.set('name', FMS.currentUser.get('name'));
                //    that.model.set('from_body', FMS.currentUser.get('from_body'));
                //    that.model.set('body', FMS.currentUser.get('body'));
                //    that.model.save();
                //    FMS.body = FMS.currentUser.get('body');
                //    FMS.isLoggedIn = 1;
                //    this.$('#botonEntidad_login').show();
                //}
                //else if (FMS.isLoggedIn && FMS.currentUser !== null && FMS.currentUser.get('email') !== undefined && FMS.currentUser.get('password') !== undefined) // Caso sin body
                //{
                //    this.validateUser(FMS.currentUser.get('email'), FMS.currentUser.get('password'));
                //}
                //this.setupHelp();
            },

            onClickLogin: function (e) {
                // prevent form submission from onscreen keyboard
                e.preventDefault();
                $('#login').focus();
                //TO DO: Borrar código cuando haya bd
                    //var that = this;
                    //that.$('#password_row').hide();
                    //that.$('#success_row').show();
                //TO DO: Borrar código cuando haya bd
                if (this.validate()) {
                    var that = this;
                    FMS.printDebug(that);
                    $.ajax({
                        url: CONFIG.FMS_URL + '/auth/ajax/ws_sign_in',
                        type: 'POST',
                        data: {
                            nroCuenta: $('#form_nroCuenta').val(),
                            contrasenha: $('#form_contrasenha').val(),
                            remember_me: 1
                        },
                        dataType: 'json',
                        timeout: 30000,
                        success: function (data, status) {
                            if (data.iniciarSesionResponse.return.nroCuenta != "") {
                                that.model.set('contrasenha', $('#form_contrasenha').val());
                                that.model.set('codigoEstadoCuenta', data.iniciarSesionResponse.return.codigoEstadoCuenta);
                                that.model.set('body', '');
                                that.model.set('frombody', 0);
                                that.model.set('name', data.iniciarSesionResponse.return.nombres + " " + data.iniciarSesionResponse.return.apellidos);
                                that.model.set('email', 'williamlgr2006@gmail.com' ); //data.iniciarSesionResponse.return.correoElectronico
                                that.model.set('nroCuenta', $('#form_nroCuenta').val());
                                that.model.set('token', data.iniciarSesionResponse.return.token);
                                that.model.save();
                                FMS.isLoggedIn = 1;
                                //Nuevo ajuste
                                FMS.Body = that.model.attributes.nroCuenta;
                                $.ajax({
                                    url: CONFIG.FMS_URL + '/reports/ajax/ws_proyectos',
                                    type: 'POST',
                                    data: {
                                        nroCuenta: that.model.attributes.nroCuenta,
                                        token: that.model.attributes.token
                                    },
                                    dataType: 'json',
                                    timeout: 30000,
                                    success: function (data) {
                                        FMS.allReporteRegalias = new FMS.Drafts();
                                        if (data.getProyectosResponse.return.length != undefined) {
                                            var index = 0;
                                            for (index = 0; index < data.getProyectosResponse.return.length ; ++index) {
                                                try {
                                                    var newProyectoMapaInversiones = new FMS.Draft();
                                                    newProyectoMapaInversiones.attributes.id = data.getProyectosResponse.return[index].id;
                                                    newProyectoMapaInversiones.attributes.description = data.getProyectosResponse.return[index].descripcionProblema;
                                                    newProyectoMapaInversiones.attributes.title = data.getProyectosResponse.return[index].nombreProyecto;
                                                    newProyectoMapaInversiones.attributes.nombreProyecto = data.getProyectosResponse.return[index].nombreProyecto;
                                                    newProyectoMapaInversiones.attributes.codigoSnip = data.getProyectosResponse.return[index].codigoSNIP;
                                                    newProyectoMapaInversiones.attributes.nroProyecto = data.getProyectosResponse.return[index].nroProyecto;
                                                    newProyectoMapaInversiones.attributes.tokenMensaje = data.getProyectosResponse.return[index].tokenMensaje;
                                                    newProyectoMapaInversiones.attributes.nroCuentaMensaje = data.getProyectosResponse.return[index].nroCuentaMensaje;
                                                    newProyectoMapaInversiones.attributes.codigoEntidad = data.getProyectosResponse.return[index].codigoEntidad;
                                                    newProyectoMapaInversiones.attributes.descripcionProblema = data.getProyectosResponse.return[index].descripcionProblema;
                                                    newProyectoMapaInversiones.attributes.codigoProyecto = data.getProyectosResponse.return[index].codigoProyecto;
                                                    newProyectoMapaInversiones.attributes.contenidoEnCartera = data.getProyectosResponse.return[index].contenidoEnCartera;
                                                    newProyectoMapaInversiones.attributes.tipoAreaInfluenciaNombre = data.getProyectosResponse.return[index].tipoAreaInfluenciaNombre;
                                                    newProyectoMapaInversiones.attributes.error = data.getProyectosResponse.return[index].error;
                                                    newProyectoMapaInversiones.attributes.nombreEntidad = data.getProyectosResponse.return[index].nombreEntidad;
                                                    FMS.allReporteRegalias.add(newProyectoMapaInversiones);
                                                }
                                                catch (err) {
                                                    alert(err.message);
                                                }
                                            }
                                        }
                                        else {
                                            var newProyectoMapaInversiones = new FMS.Draft();
                                            newProyectoMapaInversiones.attributes.id = data.getProyectosResponse.return.codigoProyecto;
                                            newProyectoMapaInversiones.attributes.description = data.getProyectosResponse.return.descripcionProblema;
                                            newProyectoMapaInversiones.attributes.title = data.getProyectosResponse.return.nombreProyecto;
                                            newProyectoMapaInversiones.attributes.nombreProyecto = data.getProyectosResponse.return.nombreProyecto;
                                            newProyectoMapaInversiones.attributes.codigoSnip = data.getProyectosResponse.return.codigoSNIP;
                                            newProyectoMapaInversiones.attributes.nroProyecto = data.getProyectosResponse.return.nroProyecto;
                                            newProyectoMapaInversiones.attributes.tokenMensaje = data.getProyectosResponse.return.tokenMensaje;
                                            newProyectoMapaInversiones.attributes.nroCuentaMensaje = data.getProyectosResponse.return.nroCuentaMensaje;
                                            newProyectoMapaInversiones.attributes.codigoEntidad = data.getProyectosResponse.return.codigoEntidad;
                                            newProyectoMapaInversiones.attributes.descripcionProblema = data.getProyectosResponse.return.descripcionProblema;
                                            newProyectoMapaInversiones.attributes.codigoProyecto = data.getProyectosResponse.return.codigoProyecto;
                                            newProyectoMapaInversiones.attributes.contenidoEnCartera = data.getProyectosResponse.return.contenidoEnCartera;
                                            newProyectoMapaInversiones.attributes.tipoAreaInfluenciaNombre = data.getProyectosResponse.return.tipoAreaInfluenciaNombre;
                                            newProyectoMapaInversiones.attributes.error = data.getProyectosResponse.return.error;
                                            newProyectoMapaInversiones.attributes.nombreEntidad = data.getProyectosResponse.return.nombreEntidad;
                                            FMS.allReporteRegalias.add(newProyectoMapaInversiones);
                                        }
                                        that.navigate('report_entidad');
                                    },
                                    error: function () {

                                        FMS.printDebug(data);
                                        FMS.printDebug(that.model.toJSON());
                                    }
                                });
                                //Fin Nuevo ajuste
                             
                            } else {
                                that.validationError('signinForm', FMS.strings.login_details_error);
                            }
                        },
                        error: function () {
                            that.validationError('signinForm', FMS.strings.login_error);
                        }
                    });
                }
            },

            onClickLogout: function (e) {
                e.preventDefault();
                var that = this;
                $.ajax({
                    url: CONFIG.FMS_URL + '/auth/ajax/sign_out',
                    type: 'GET',
                    dataType: 'json',
                    timeout: 30000,
                    success: function (data, status) {
                        FMS.isLoggedIn = 0;
                        that.model.set('password', '');
                        that.model.save();
                        that.$('#form_nroCuenta').val('');
                        that.$('#form_contrasenha').val('');
                        that.$('#success_row').hide();
                        that.$('#signed_in_row').hide();
                        that.$('#password_row').show();
                    },
                    error: function () {
                        that.validationError('err', FMS.strings.logout_error);
                    }
                });
            },

            onClickProyectos: function (e) {
                e.preventDefault();
                var a = this;
                //TO DO: Eliminar este código cuando BD esté online
                //a.navigate('report_entidad');
                //TO DO: Eliminar este código cuando BD esté online
                FMS.Body = this.model.attributes.nroCuenta;
                $.ajax({
                    url: CONFIG.FMS_URL + '/reports/ajax/ws_proyectos',
                    type: 'POST',
                    data: {
                        nroCuenta:this.model.attributes.nroCuenta,
                        token: this.model.attributes.token
                    },
                    dataType: 'json',
                    timeout: 30000,
                    success: function (data)          
                    {
                        FMS.allReporteRegalias = new FMS.Drafts();
                        if (data.getProyectosResponse.return.length != undefined) {
                            var index = 0;
                            for (index = 0; index < data.getProyectosResponse.return.length ; ++index) {
                                try {
                                    var newProyectoMapaInversiones = new FMS.Draft();
                                    newProyectoMapaInversiones.attributes.id = data.getProyectosResponse.return[index].codigoProyecto;
                                    newProyectoMapaInversiones.attributes.description = data.getProyectosResponse.return[index].descripcionProblema;
                                    newProyectoMapaInversiones.attributes.title = data.getProyectosResponse.return[index].nombreProyecto;
                                    newProyectoMapaInversiones.attributes.nombreProyecto = data.getProyectosResponse.return[index].nombreProyecto;
                                    newProyectoMapaInversiones.attributes.codigoSnip = data.getProyectosResponse.return[index].codigoSNIP;
                                    newProyectoMapaInversiones.attributes.nroProyecto = data.getProyectosResponse.return[index].nroProyecto;
                                    newProyectoMapaInversiones.attributes.tokenMensaje = data.getProyectosResponse.return[index].tokenMensaje;
                                    newProyectoMapaInversiones.attributes.nroCuentaMensaje = data.getProyectosResponse.return[index].nroCuentaMensaje;
                                    newProyectoMapaInversiones.attributes.codigoEntidad = data.getProyectosResponse.return[index].codigoEntidad;
                                    newProyectoMapaInversiones.attributes.descripcionProblema = data.getProyectosResponse.return[index].descripcionProblema;
                                    newProyectoMapaInversiones.attributes.codigoProyecto = data.getProyectosResponse.return[index].codigoProyecto;
                                    newProyectoMapaInversiones.attributes.contenidoEnCartera = data.getProyectosResponse.return[index].contenidoEnCartera;
                                    newProyectoMapaInversiones.attributes.tipoAreaInfluenciaNombre = data.getProyectosResponse.return[index].tipoAreaInfluenciaNombre;
                                    newProyectoMapaInversiones.attributes.error = data.getProyectosResponse.return[index].error;
                                    newProyectoMapaInversiones.attributes.nombreEntidad = data.getProyectosResponse.return[index].nombreEntidad;
                                    FMS.allReporteRegalias.add(newProyectoMapaInversiones);
                                }
                                catch (err) {
                                    alert(err.message);
                                }
                            }
                        }
                        else
                        {
                            var newProyectoMapaInversiones = new FMS.Draft();
                            newProyectoMapaInversiones.attributes.id = data.getProyectosResponse.return.codigoProyecto;
                            newProyectoMapaInversiones.attributes.description = data.getProyectosResponse.return.descripcionProblema;
                            newProyectoMapaInversiones.attributes.title = data.getProyectosResponse.return.nombreProyecto;
                            newProyectoMapaInversiones.attributes.nombreProyecto = data.getProyectosResponse.return.nombreProyecto;
                            newProyectoMapaInversiones.attributes.codigoSnip = data.getProyectosResponse.return.codigoSNIP;
                            newProyectoMapaInversiones.attributes.nroProyecto = data.getProyectosResponse.return.nroProyecto;
                            newProyectoMapaInversiones.attributes.tokenMensaje = data.getProyectosResponse.return.tokenMensaje;
                            newProyectoMapaInversiones.attributes.nroCuentaMensaje = data.getProyectosResponse.return.nroCuentaMensaje;
                            newProyectoMapaInversiones.attributes.codigoEntidad = data.getProyectosResponse.return.codigoEntidad;
                            newProyectoMapaInversiones.attributes.descripcionProblema = data.getProyectosResponse.return.descripcionProblema;
                            newProyectoMapaInversiones.attributes.codigoProyecto = data.getProyectosResponse.return.codigoProyecto;
                            newProyectoMapaInversiones.attributes.contenidoEnCartera = data.getProyectosResponse.return.contenidoEnCartera;
                            newProyectoMapaInversiones.attributes.tipoAreaInfluenciaNombre = data.getProyectosResponse.return.tipoAreaInfluenciaNombre;
                            newProyectoMapaInversiones.attributes.error = data.getProyectosResponse.return.error;
                            newProyectoMapaInversiones.attributes.nombreEntidad = data.getProyectosResponse.return.nombreEntidad;
                            FMS.allReporteRegalias.add(newProyectoMapaInversiones);
                        }
                        a.navigate('report_entidad');
                    },
                    error: function () {

                        FMS.printDebug(data);
                        FMS.printDebug(that.model.toJSON());
                    }
                });
            },

            validate: function () {
                this.clearValidationErrors();
                var isValid = 1;

                if (!$('#form_contrasenha').val()) {
                    isValid = 0;
                    this.validationError('form_contrasenha', FMS.validationStrings.password);
                }

                var nroCuenta = $('#form_nroCuenta').val();
                if (!nroCuenta) {
                    isValid = 0;
                    this.validationError('form_nroCuenta', FMS.validationStrings.email.required);
                    // regexp stolen from jquery validate module
                } //else if ( ! /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email) ) {
                //isValid = 0;
                //this.validationError('form_email', FMS.validationStrings.email.email);
                //}

                if (!isValid) {
                    // this makes sure the onscreen keyboard is dismissed
                    $('#login').focus();
                }

                return isValid;
            }
        })
    });
})(FMS, Backbone, _, $);
(function(FMS, Backbone, _, $, moment) {
    _.extend( FMS, {
        Draft: Backbone.Model.extend({
            localStorage: new Backbone.LocalStorage(CONFIG.NAMESPACE + '-drafts'),

            defaults: {
                lat: 0,
                lon: 0,
                title: '',
                details: '',
                may_show_name: '',
                category: '',
                phone: '',
                pc: '',
                file: '',
                created: moment.utc(),
                id_proyecto: 0
                //Agrego las nuevas variables para paraguay,
                //nombreProyecto: '',
                //codigoSnip:'',
                //nroProyecto:'',
                //tokenMensaje:'',
                //nroCuentaMensaje:'',
                //codigoEntidad:'',
                //descripcionProblema:'',
                //codigoProyecto:'',
                //contenidoEnCartera:'',
                //tipoAreaInfluenciaNombre:'',
                //error:'',
                //nombreEntidad:''
            },

            //idProyecto: function()
            //{
            //    var rta = '';
            //    if (this.get('id'))
            //    {
            //        rta = this.get('id');
            //    }
            //    return rta;
            //},

            description: function() {
                moment.locale('es');
                var desc = '';
                if (this.get('title'))
                {
                    desc += this.get('title');//.toUpperCase()
                    //Modificación Mayo 2016. Corrige problema de comparar la fecha del reporte con el valor actual. Español-Colombia
                    //desc += '<br><small>' + moment.utc(moment.utc(this.created).format('MM/DD/YYYY HH:mm:ss')).fromNow() + '</small>';
                }
                else
                {
                    desc += 'Borrador sin t\u00EDtulo';
                    //Modificación Abril 2016. Corrige problema de formato de fecha. Español-Colombia
                    //desc += '<br><small>' + moment.utc(moment.utc(this.created).format('MM/DD/YYYY HH:mm:ss')).fromNow() + '</small>';
                }
                //desc += '<br><small>' + moment.utc( this.get('created') ).fromNow() + '</small>';
                return desc;
            },

            isPartial: function() {
                if (
                    this.get('title') ||
                    this.get('details') ||
                    this.get('category') ||
                    this.get('file')
                ) {
                    return true;
                }

                return false;
            },

            createdDate: function() {
                return moment.utc( this.get('created') ).format( 'H:mm Do MMM' );
            }
        })
    });
})(FMS, Backbone, _, $, moment);

//Se crea una colección del modelo Drafts.
(function(FMS, Backbone, _, $) {
    _.extend( FMS, {
        Drafts: Backbone.Collection.extend({
            model: FMS.Draft,
            localStorage: new Backbone.LocalStorage(CONFIG.NAMESPACE + '-drafts')
        })
    });
})(FMS, Backbone, _, $);

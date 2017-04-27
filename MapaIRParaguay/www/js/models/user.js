//Se crea un modelo llamado User
(function (FMS, Backbone, _, $) {
    _.extend( FMS, {
        User: Backbone.Model.extend({
            localStorage: new Backbone.LocalStorage(CONFIG.NAMESPACE + '-users')
        })
    });
})(FMS, Backbone, _, $);


//Se crea una colecci�n llamada Users
(function(FMS, Backbone, _, $) {
    _.extend( FMS, {
        Users: Backbone.Collection.extend({
            model: FMS.User,
            localStorage: new Backbone.LocalStorage(CONFIG.NAMESPACE + '-users')
        })
    });
})(FMS, Backbone, _, $);

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _advert = new Schema({
        nom:            { type: String },
        numero:         { type: String },
        ville:          { type: String },
        codepostal:     { type: String },
        date:           { type: String },
        title:          { type: String },
        marque:         { type: String },
        modele:         { type: String },
        anneemodele:    { type: String },
        prix:           { type: String },
        kilometrage:    { type: String },
        carburant:      { type: String },
        boitevitesse:   { type: String },
        description:    { type: String },
        lien:           { type: String },
        _date:          { type: Date, default: Date.now()},
        urgent:         { type: Boolean, default:false },
        particulier:    { type: Boolean, default: false },
        saved:          { type: Boolean, default: false }
    }),
    advert = mongoose.model('adverts', _advert);

var lbc = function(){
    return this;
};

lbc.prototype.connect = function(callback){
    var connection_string = '127.0.0.1:27017/main';
// if OPENSHIFT env variables are present, use the available connection info:
    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
        connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
    }
    var conn = mongoose.connect(connection_string, function(error) {
        if(error) throw error;
        callback(error, conn);
    });
};

lbc.prototype.advert = advert;

module.exports = lbc;

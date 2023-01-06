const dbConfig = require("../config/db.config.js");
const constant = require('../constant/constant');
// const dbconfig = require("../config/config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
const prefix = "prefix";
db.mongoose = mongoose;
// db.url = dbConfig.url;

// feed data
db.gcfeeds = require("./gcfeeds.model.js")(mongoose);
db.gcsections = require("./gcsections.model.js")(mongoose);

db.ssfeeds = require("./ssfeeds.model.js")(mongoose);
db.sssections = require("./sssections.model.js")(mongoose);

db.mgfeeds = require("./mgfeeds.model.js")(mongoose);
db.mgsections = require("./mgsections.model.js")(mongoose);

// user 
db.guestuser = require("./guestuser.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);

// module.exports = db;

exports.get = function get(env, dbname){
    // console.log(';env, dbname index,', env, dbname)
    db['dbObj'] = dbConfig.get(env, dbname);
    return db;
}

exports.getModel = function get(modelName){
    console.log('getModel',db[modelName])
    return db[modelName];
}

// exports.getMongoose = function get(mong){
//     return db.mongoose;
// }
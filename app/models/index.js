const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.feeds = require("./feeds.model.js")(mongoose);
db.feedsections = require("./feeds.sections.model.js")(mongoose);
db.guestuser = require("./guest.user.model.js")(mongoose);
db.User = require("./user.model.js")(mongoose);

module.exports = db;

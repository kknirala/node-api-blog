const express = require("express");
const cors = require("cors");
const cookieParser=require('cookie-parser');
const dbname = 'dbBlog';
const db = require("./app/models").get(process.env.NODE_ENV, dbname);
const constants = require("./app/constant/constant.js");
// const config =require('./config/config').get(process.env.NODE_ENV);

const app = express();

var corsOptions = {
  origin: constants.origin
};

app.use(cors(corsOptions));
app.use(cookieParser());


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);
// req.ip  --> to get IP address of the requester.
// const db = require("./app/models");

console.log('server db dbObj',db.dbObj)
db.mongoose
  .connect(db.dbObj.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/admin", (req, res) => {
  res.json({ message: "Welcome to admin portal." });
});

require("./app/routes/feeds.routes")(app);
require("./app/routes/guest.user.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/sections.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

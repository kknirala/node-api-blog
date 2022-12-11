module.exports = {
  url: "mongodb://localhost:27017/db_blog"
};



// const config={
//   production :{
//       SECRET: process.env.SECRET,
//       DATABASE: process.env.MONGODB_URI
//   },
//   default : {
//       SECRET: 'mysecretkey',
//       DATABASE: 'mongodb://localhost:27017/Users'
//   }
// }


// exports.get = function get(env){
//   return config[env] || config.default
// }

// const mongoose = require("mongoose");

// const { MONGO_URI } = process.env;

// exports.connect = () => {
  // Connecting to the database
//   mongoose
//     .connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     })
//     .then(() => {
//       console.log("Successfully connected to database");
//     })
//     .catch((error) => {
//       console.log("database connection failed. exiting now...");
//       console.error(error);
//       process.exit(1);
//     });
// };
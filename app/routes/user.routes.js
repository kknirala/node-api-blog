const {auth} =require("../middlewares/auth.js");
const {permissionCheck} =require("../middlewares/permissionCheck.js");


module.exports = app => {
  const user = require("../controllers/user.controller.js");
  
  // const controller = require("../controllers");

  // controller.get('weburl').create;

  var router = require("express").Router();

  // Register a new User
  router.post("/register", user.create);

  // Login
  router.post("/login", user.login);

  // logout 
  router.post("/logout",auth, user.logout);

  // get logged in user
  // router.post("/profile/:id",auth, user.profile);

  // Retrieve all user
  router.get("/", permissionCheck, user.findAll);

   // Retrieve all roles
  //  router.get("/roles", user.roles);

  // Retrieve a single User with id
  router.get("/:id",permissionCheck, user.findOne);

  // Update a User with id 
  router.put("/:id",permissionCheck, user.update);

  // Delete a User with id
  router.delete("/:id", permissionCheck, user.delete);

  // Delete all users
  router.delete("/", permissionCheck, user.deleteAll);

  app.use("/api/user", router);
};

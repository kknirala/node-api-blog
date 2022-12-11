const {auth} =require("../middlewares/auth.js");

module.exports = app => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Register a new User
  router.post("/register", user.create);

  // Login
  router.post("/login",auth, user.login);

  // logout 
  router.post("/logout",auth, user.logout);

  // get logged in user
  router.post("/profile",auth, user.profile);

  // Retrieve all user
  router.get("/", user.findAll);

  // Retrieve a single User with id
  router.get("/:id", user.findOne);

  // Update a User with id 
  router.put("/:id", user.update);

  // Delete a User with id
  router.delete("/:id", user.delete);

  // Delete all users
  router.delete("/", user.deleteAll);

  app.use("/api/user", router);
};

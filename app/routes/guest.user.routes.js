module.exports = app => {
  const guestuser = require("../controllers/guest.user.controller.js");

  var router = require("express").Router();

  // Register a new guest user
  router.post("/", guestuser.create);

  // Retrieve all Guest user
  router.get("/", guestuser.findAll);

  // Retrieve a single Guest User with id
  router.get("/:id", guestuser.findOne);

  // Update a Guest User with id 
  router.put("/:id", guestuser.update);

  // Delete a Guest User with id
  router.delete("/:id", guestuser.delete);

  // Delete all Guest users
  router.delete("/", guestuser.deleteAll);

  app.use("/api/guestuser", router);
};

const {permissionCheck} =require("../middlewares/permissionCheck.js");

module.exports = app => {
  const guestuser = require("../controllers/guestuser.controller.js");

  var router = require("express").Router();

  // Register a new guest user
  router.post("/", guestuser.create);

  // Retrieve all Guest user
  router.get("/", permissionCheck, guestuser.findAll);

  // Retrieve a single Guest User with id
  router.get("/:id",permissionCheck, guestuser.findOne);

  // Update a Guest User with id 
  router.put("/:id", permissionCheck, guestuser.update);

  // Delete a Guest User with id
  router.delete("/:id", permissionCheck, guestuser.delete);

  // Delete all Guest users
  router.delete("/", permissionCheck, guestuser.deleteAll);

  app.use("/api/guestuser", router);
};

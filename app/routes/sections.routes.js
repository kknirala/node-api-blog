const {auth} =require("../middlewares/auth.js");
const {permissionCheck} =require("../middlewares/permissionCheck.js");

module.exports = app => {
  const sections = require("../controllers/section.controller.js");

  var router = require("express").Router();

  // Create a new Section
  router.post("/", sections.create);

  // Retrieve all sections
  router.get("/allsections/:feedId", sections.findAll);

  // Retrieve all published sections
  router.get("/published", sections.findAllPublished);

  // Retrieve all unpublished sections
  router.get("/unpublished", permissionCheck, sections.findAllUnPublished);
  // /api/sections/def/published

  // Retrieve all unpublished sections
  // router.get("/:feedId/unpublished", permissionCheck, sections.findAllUnPublished);

  // Retrieve a single Section with id
  router.get("/:feedId/:id", sections.findOne);

  // Update a Section with id
  router.put("/:feedId/:id",auth, sections.update);

   // Publish / unpublish a Section with id
  router.put("/publish",permissionCheck, sections.publish);

  // Delete a Section with id
  router.delete("/deleteone", auth, sections.delete);

  // delete all sections
  router.delete("/deleteAll", auth, sections.deleteAll);

   // delete all sections of feed permanent
   router.delete("/deleteonepr", auth, sections.deleteOnePr);

  // delete all sections of all feeds permanent
  router.delete("/deleteallpr", auth, sections.deleteAllPr);

  app.use("/api/sections", router);
};

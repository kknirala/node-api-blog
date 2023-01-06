const {auth} =require("../middlewares/auth.js");
const {permissionCheck} =require("../middlewares/permissionCheck.js");

module.exports = app => {
  const feeds = require("../controllers/feed.controller.js");

  var router = require("express").Router();

  // Create a new Feed
  router.post("/", feeds.create);

  // Retrieve all Feeds
  router.get("/", feeds.findAll);

   // Retrieve my Feeds
   router.get("/myfeeds",auth, feeds.myFeed);

  // Retrieve all published Feeds
  router.get("/published", feeds.findAllPublished);

  // Retrieve all unpublished Feeds
  router.get("/unpublished", permissionCheck, feeds.findAllUnPublished);

  // Retrieve a single Feed with id
  router.get("/:id", feeds.findOne);

  // Update a Feed with id
  router.put("/:id",auth, feeds.update);

   // Publish a Feed with id
   router.put("/publish/:id",permissionCheck, feeds.publish);

  // Delete a Feed with id
  router.delete("/:id", auth, feeds.delete);

  // Create a new Feed
  router.delete("/", auth, feeds.deleteAll);

  app.use("/api/feeds", router);
};

const db = require("../models");
const Feeds = db.feeds;
const User = db.User;

// Create and Save a new Feed
exports.create = (req, res) => {
  // Validate request
  console.log(req.body);
  const {title, html, desc, createdBy} = req.body;

  if (!req.body.title || !req.body.html) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Feed
  const feed = new Feeds({
    title,
    desc,
    html,
    published: req.body.published || false,
    titlPic: req.body.titlPic,
    isDeleted: false,
    createdBy,
    modifiedBy: null,
    sections: req.body.sections || []
  });

  // Save Feed in the database
  feed
    .save(feed)
    .then(data => {
      console.log(data)
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Feed."
      });
    });
};

// Retrieve my Feeds from the database.
exports.myFeed = async(req, res) => {
  console.log(req.query.email)

  const createdBy = req.query.email;
  // let createdBy = await findUserById(req.query.id, 'email');
  console.log(createdBy)
  Feeds.find({createdBy: createdBy})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving feeds."
      });
    });
};

// Retrieve all Feeds from the database.
exports.findAll = (req, res) => {

  Feeds.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving feeds."
      });
    });
};

// Find a single Feed with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Feeds.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Feed with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Feed with id=" + id });
    });
};

// Update a Feed by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Feeds.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Feed with id=${id}. Maybe Feed was not found!`
        });
      } else res.send({ message: "Feed was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Feed with id=" + id
      });
    });
};

// Delete a Feed with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Feeds.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Feed with id=${id}. Maybe Feed was not found!`
        });
      } else {
        res.send({
          message: "Feed was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Feed with id=" + id
      });
    });
};

// Delete all Feeds from the database.
exports.deleteAll = (req, res) => {
  Feeds.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Feeds were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all feeds."
      });
    });
};

// Find all published Feeds
exports.findAllPublished = (req, res) => {
  Feeds.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving feeeds."
      });
    });
};

// Find all unpublished Feeds
exports.findAllUnPublished = (req, res) => {
  Feeds.find({ published: false })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving feeeds."
      });
    });
};
// Find user email by user id
// let findUserById = async(id, key) =>{
//   await User.findById(id)
//     .then(data => {
//       console.log('data-->',data[key]);
//       if (!data)
//         return null;
//       else {console.log('email-->',data[key]); return data[key]; }
//     })
//     .catch(err => {
//        return null;
//     });
// };


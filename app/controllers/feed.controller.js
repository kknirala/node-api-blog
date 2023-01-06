const utility = require('../utility/utility.js');
const db = require("../models");
// const User = db.User;
// const Feeds = '';
const defmodel = 'feeds';
const usrmodel = 'user';
const gsusrmodel = 'guestuser';

function loadModel(modelName){
    return db.getModel(modelName);
}
// Create and Save a new Feed
exports.create = async(req, res) => {
  try {
  let Feeds = loadModel(req.headers.weburls+defmodel);
  // let User = loadModel(usrmodel);
  // Validate request
  console.log(req.body);
  // const {title, html, desc, createdBy} = req.body;

  if (!req.body.title || !req.body.html) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Feed
  const feed = new Feeds(utility.gcFeedAPI(req.body));

  // Save Feed in the database
  await feed
    .save((err,data) => {
      if(err) {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Feed."
        });
      }
      console.log(data);
      if(req.body.createdBy == 'guest' && req.body.email){
        saveGuser(req.body, (data._id).toString());
      }
      res.send(data);
    });
    // .catch(err => {
    //   res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while creating the Feed."
    //   });
    // });
  } catch (err) {
    console.log(err);
  }
};

// Retrieve my Feeds from the database.
exports.myFeed = async(req, res) => {
  let Feeds = loadModel(req.headers.weburls+defmodel);
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
exports.findAll = async(req, res) => {
  console.log(req.headers.weburls+defmodel);
  let Feeds = loadModel(req.headers.weburls+defmodel);
  Feeds.find()
    .then(async(data) => {
      await sleep(5000);
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
  let Feeds = loadModel(req.headers.weburls+defmodel);
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
  let Feeds = loadModel(req.headers.weburls+defmodel);
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  delete req.body.published;
  console.log("update me",req.body);
  Feeds.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
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
  let Feeds = loadModel(req.headers.weburls+defmodel);
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
  let Feeds = loadModel(req.headers.weburls+defmodel);
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
exports.findAllPublished = async(req, res) => {
  // const Feeds = db.getModel('feeds');
  // console.log('feed',Feeds);
  // await sleep(5000);
  console.log(req.headers.weburls);
  let Feeds = loadModel(req.headers.weburls+defmodel);
  Feeds.find({"published": true})
    .then(data => {
      
      // console.log('published', data);
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
  let Feeds = loadModel(req.headers.weburls+defmodel);
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

exports.publish  = (req, res) => {
  let Feeds = loadModel(req.headers.weburls+defmodel);
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  Feeds.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot publish Feed with id=${id}. Maybe Feed was not found!`
        });
      } else res.send({ message: "Feed was published successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error publishing Feed with id=" + id
      });
    });
};

// Find all unpublished Feeds
exports.findAllUnPublished = (req, res) => {
  let Feeds = loadModel(req.headers.weburls+defmodel);
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

async function saveGuser(body, feedId) {
  try{
  let GuestUsers = loadModel(gsusrmodel);
  const stories = [];
  // stories.push(feedId);
  const {email, createdBy} = body;
  // console.log('guest user body', body, feedId);
  let oldUser = await GuestUsers.findOne({ email });

  if (oldUser) {
    oldUser.stories.push(feedId);
    oldUser.save();
  }
  else{
    const guser = await GuestUsers.create(utility.guserAPiRequest({email, createdBy, stories}));
    // console.log('guest user', guser);
    guser.save().then({}).catch({})
  }
}
  catch(err){
    console.log(err)
    return true;
  }
}
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


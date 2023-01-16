const utility = require('../utility/utility.js');
const db = require("../models");
const feedValidator = require('../middlewares/validateFeed.js');

const defmodel = 'sections';
const usrmodel = 'user';
const gsusrmodel = 'guestuser';

function loadModel(modelName){
    return db.getModel(modelName);
}
// Create and Save a new Section
exports.create = async(req, res) => {
  try {
  let Section = loadModel(req.headers.weburls+defmodel);
  console.log(req.body);
  if (!req.body.html && !req.body.feedId) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

    await Section.findOneAndUpdate({
        feedId: req.body.feedId
      },
      {$push:{sections: req.body.section}, isDeleted: false},
      {
        upsert: true
      }).then(data => {
        // res.send(data);
        if(req.body.createdBy == 'guest' && req.body.email){
          saveGuser(req.body, (data._id).toString());
        }
        res.send({message:'updated successfully.'});
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while inserting section"
        });
      });
  
  } catch (err) {
    console.log(err);
  }
};

// Retrieve all Sections from the database.
exports.findAll = (req, res) => {
  console.log("ABC--",req.headers.weburls+defmodel, req.params.feedId);
  let Sections = loadModel(req.headers.weburls+defmodel);
  Sections.find({"feedId": req.params.feedId})
    .then(data => {
      if(data[0] && !data[0].isDeleted){
        data[0].sections = data[0].sections.filter(dt=> dt.isDeleted === false);
        res.send(data[0]);
      }
      else res.send([]);
      // res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving feeds."
      });
    });
};


// let userData = {productCode: "4pf"}
// let dataToBeUpdated = {claims: ["abc", "def"]}
// products: [{ productCode }]
// ProductModel.findOneAndUpdate({"products.productCode": userData.productCode}, {$set: {"products.$": dataToBeUpdated}})
// Find a single Section with an id
exports.findOne = (req, res) => {
  let Sections = loadModel(req.headers.weburls+defmodel);
  const id = req.params.id;
  console.log('section id', id, req.params.feedId)
  
  Sections.find({"feedId" : req.params.feedId, "sections._id":id},{"sections.$":1})
 .then(data => {
      console.log('data--',data[0].sections[0])
      if (!data)
        res.status(404).send({ message: "Not found Section with id " + id });
      else res.send(data[0].sections[0]);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Section with id=" + id });
    });
};

// Update a Feed by the id in the request
exports.update = async(req, res) => {
  let Sections = loadModel(req.headers.weburls+defmodel);
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  // delete req.body.published;
  console.log("update me",req.body);
  try{
   
      Sections.updateOne({"feedId" : req.params.feedId, "sections._id":id},{
        "sections.$.html":req.body.html
      }).then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Section with id=${id}. Maybe Section was not found!`
        });
      } else res.send({ message: "Section was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating section with id=" + id
      });
    });
}catch(err){
    console.log(err)
}
}

// Find all published or Unpublished sections
exports.findAllPublished = async(req, res) => {
  // const Feeds = db.getModel('feeds');
  // console.log('feed',Feeds);
  console.log('weburls--->',req.headers.weburls, req.query.feedId);
  let Sections = loadModel(req.headers.weburls+defmodel);
  // Feeds.find({"published": true})
  //   await Sections.aggegate([
  //     { $match: { "feedId" : req.query.feedId , "sections.published":  req.query.published} },
  //     { $unwind: { sections: 1 } }
  // ])
  // Sections.find({"feedId" : req.params.feedId, "sections._id":id},{"sections.$":1})
  // await Sections.find({"feedId" : req.query.feedId, "sections.$.published": true},{"sections":1})

  Sections.find( 
    {
     "feedId" : req.query.feedId
    }, 
    {"sections":1}
 )
  .then(data => {
    if(data[0] && !data[0].isDeleted){
      const sections = data[0].sections;
        console.log('published',  sections.filter(value => value.published === true));
        res.send(sections.filter(dt=> dt.isDeleted === false));
        // res.send(sections.filter(dt=> dt.published === true && dt.isDeleted === false));
    } else res.send([]);

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving feeeds."
      });
    });
};
exports.findAllUnPublished = async(req, res) => {
  // const Feeds = db.getModel('feeds');
  // console.log('feed',Feeds);
  console.log('weburls--->',req.headers.weburls,  req.query.feedId);
  let Sections = loadModel(req.headers.weburls+defmodel);

  // Feeds.find({"published": true})
  //   await Sections.aggegate([
  //     { $match: { "feedId" : req.query.feedId , "sections.published":  req.query.published} },
  //     { $unwind: { sections: 1 } }
  // ])
  // Sections.find({"feedId" : req.params.feedId, "sections._id":id},{"sections.$":1})
  // await Sections.find({"feedId" : req.query.feedId, "sections.$.published": true},{"sections":1})

  Sections.find( 
    {
      "feedId" : req.query.feedId,
     "sections.published": false
    }, 
    {"sections":1}
 )
  .then(data => {
    const sections = data[0].sections;
      console.log('published',  sections.filter(value => value.published === true))
      res.send(sections.filter(dt=> dt.published === false));
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving feeeds."
      });
    });
};

// Publish / Unpublish section
exports.publish  = (req, res) => {
  console.log('publish it..')
  let Sections = loadModel(req.headers.weburls+defmodel);
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  // const id = req.body.id;
  // Feeds.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
  Sections.updateOne({"feedId" : req.body.feedId, "sections._id":req.body.id},{
    "sections.$.published": req.body.published
  })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot publish Section with id=${id}. Maybe Section was not found!`
        });
      } else res.send({ message: "Section was published successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error publishing Section with id=" + id
      });
    });
};

// Find all unpublished Feeds
// exports.findAllUnPublished = (req, res) => {
//   let Feeds = loadModel(req.headers.weburls+defmodel);
//   Feeds.find({ published: false })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving feeeds."
//       });
//     });
// };
// Delete or restore a Section with the specified id in the request
exports.delete = (req, res) => {
  // const id = req.query.id;
  let Sections = loadModel(req.headers.weburls+defmodel);
  // Feeds.findByIdAndRemove(id, { useFindAndModify: false })
   Sections.updateOne({"feedId" : req.query.feedId, "sections._id":req.query.id},{
        "sections.$.isDeleted":req.query.isDeleted,
      })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Section with id=${id}. Maybe Section was not found!`
        });
      } else {
        res.send({
          message: "Section was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Section with id=" + id
      });
    });
};

// Delete or restore all sections from the database.
exports.deleteAll = (req, res) => {
  let Sections = loadModel(req.headers.weburls+defmodel);
  // Sections.updateMany({"feedId" : req.query.feedId}, {"$set":{"sections.isDeleted": req.query.isDeleted}}, { multi: true })
  //  Sections.update({"feedId" : req.query.feedId},{$set:{"sections.$[].isDeleted":req.query.isDeleted}},false,true)
  Sections.update({"feedId" : req.query.feedId}, {$set: {"sections.$[].isDeleted": req.query.isDeleted, isDeleted: req.query.isDeleted}})


  // Sections.updateOne({"feedId" : req.params.feedId},{
  //   "sections.$.isDeleted":req.body.isDeleted,
  //   isDeleted: req.body.isDeleted,
  // })
    .then(data => {
      console.log(data);
      res.send({
        message: `All sections were deleted successfully!`
      });
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all sections."
      });
    });
};


// Delete or restore all sections from the database.
exports.deleteOnePr = (req, res) => {
  let Sections = loadModel(req.headers.weburls+defmodel);
  Sections.deleteOne({"feedId" : req.query.feedId})
  .then(data => {
    res.send({
      message: `All sections were deleted Permanently!`
    });
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all sections."
      });
    });
};

// Delete or restore all sections from the database.
exports.deleteAllPr = (req, res) => {
  let Sections = loadModel(req.headers.weburls+defmodel);
  Sections.deleteMany({})
  .then(data => {
    res.send({
      message: `All sections were deleted Permanently!`
    });
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all sections."
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


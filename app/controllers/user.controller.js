const db = require("../models").get(process.env.NODE_ENV, 'dbBlog');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = db.user;
const utility = require('../utility/utility.js');
const constant = require('../constant/constant.js');

// const salt = 10;
// Register new user
exports.create = async(req, res) => {
  try {
    const { email } = req.body;
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const user = await User.create(utility.userAPiRequest(req.body));
    user.save((err,user)=>{
      if(err) {console.log(err);
          return res.status(400).json({ success : false});}
      else{   
         res.status(200).json(utility.userAPiResponse(200,'success',user));
      }
   });
  } catch (err) {
    console.log(err);
  }
}


// Retrieve all user from the database.
exports.findAll = (req, res) => {

  User.find({token:0})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Retrieve all Users by name from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  User.find(condition, {token:0})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id, {token:0})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving user with id=" + id });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all User from the database.
exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} User were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all feeds."
      });
    });
};

// login
exports.login = (req, res) => {
  let token=req.cookies.auth;
    User.findByToken(token,(err,user)=>{
      console.log(err);
        if(err) return  res(err);
        if(user && user.email == req.body.email){
          if(user) return res.status(400).json({
            error :true,
            message:"You are already logged in"
         });
        }
        else{
            User.findOne({'email':req.body.email},function(err,user){
                if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
              
                user.comparepassword(req.body.password,(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
        
                user.generateToken((err,user)=>{
                  console.log('generateToken',err);
                    if(err) return res.status(400).send(err);
                  
                    res.cookie('auth',user.token).json({
                        userid : user.token,
                        id : user._id,
                        email : user.email,
                        userName: user.userName,
                        role: constant.roles[user.role]
                    });
                });    
            });
          });
        }
    });
};

// logout 
exports.logout = (req, res) => {
  console.log('calling logout');
  req.user.deleteToken(req.headers.token,(err,user)=>{
    if(err) return res.status(400).send(err);
    res.sendStatus(200);
  });
};

// Get logged in profile
// exports.profile = (req, res) =>{
//   return findOne(req, res);
//   // res.json({
//   //   role: req.,
//   //   id: req.user._id,
//   //   email: req.user.email,
//   //   name: req.user.name
//   // })
// };

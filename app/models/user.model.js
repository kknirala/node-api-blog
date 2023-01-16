const jwt = require("jsonwebtoken");
const config=require('../config/db.config').get(process.env.NODE_ENV, 'dbBlog');
const bcrypt = require('bcryptjs');
const salt = 10;
const dbName = 'dbBlog';
const constant = require('../constant/constant.js');

// A - admin, SA - Super admin, B - Back end team(direct DB access), SU - support user, EU - End user
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      role: {
        type: String,
        required: true,
        enum: ["A", "SA", "B", "SU", "EU"],
        immutable: true,
        maxlength: 2
      },
      name: {
        type: String,
        required: true,
        maxlength: 100
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: 1 
      },
      phoneCode: {
        type: String,
        required: false,
        maxlength: 3
      },
      phone: { 
        type: Number,
        required: false,
        maxlength: 10
      },
      qualification: String,
      occupation: {
        type: String,
        default: 'Student'
      },
      areaOfInteres: Array,
      picUrl: String,
      userName: String,
      password:{
        type:String,
        required: true,
        // select: false,
        minlength:3
    },
      password2:{
          type:String,
          required: false,
          // select: false,
          minlength:3

      },
      token:{
          type: String
      },
      following : {
        type: Array,
        count: Number,
        ids: []
      },
      followers : {
        type: Array,
        count: Number,
        ids: []
      },
      stories : {
        type: Array,
        count: Number,
        ids: []
      },
      userOf: {
        type: Array
      }
    },
    { timestamps: true }
  );

    // to signup a user
  schema.pre('save',function(next){
  var user=this;
  
  if(user.isModified('password')){
    console.log('is modified');
      bcrypt.genSalt(salt,function(err,salt){
          if(err)return next(err);

          bcrypt.hash(user.password,salt,function(err,hash){
              if(err) return next(err);
              user.password=hash;
              // user.password2=hash;
              next();
          })

      })
  }
  else{
    console.log('direct next..')
      next();
  }
});

//to login
schema.method("comparepassword",function(password,cb){
  console.log('password matching', password, this.password)
  bcrypt.compare(password,this.password,function(err,isMatch){
      if(err) return cb(err);
      cb(null,isMatch);
  });
});

// generate token

schema.method("generateToken",function(cb){
  var user =this;
  var token=jwt.sign(user._id.toHexString(),config.SECRET);

  user.token=token;
  user.save(function(err,user){
      if(err) return cb(err);
      cb(null,user);
  })
});

// find by token
schema.statics.findByToken=function(token,cb){
  // console.log(token, "calling user for token", config);
  var user=this;
  // console.log('user-->', user.token);

  jwt.verify(token,config.SECRET,function(err,decode){
      user.findOne({"_id": decode, "token":token},function(err,user){
        // console.log('find by toke',user)
          if(err) return cb(err);
          cb(null,user);
      })
  })
};

//delete token

schema.method("deleteToken", function(token,cb){
  var user=this;

  user.updateOne({$unset : {token :1}},function(err,user){
      if(err) return cb(err);
      cb(null,user);
  });
  console.log("Delete token--",user);
});

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    delete object.password;
    delete object.password2;
    object.role = constant.roles[object.role];
    return object;
  });

  const Users = mongoose.model("users", schema);
  return Users;
};

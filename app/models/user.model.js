const jwt = require("jsonwebtoken");
const confiq=require('../config/config').get(process.env.NODE_ENV);
const bcrypt = require('bcryptjs');
const salt = 10;
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      utype: {
        type: String,
        required: true,
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
        unique: 1
      },
      phoneCode: {
        type: String,
        required: false,
        maxlength: 3
      },
      phone: { type: Number,
        required: true,
        maxlength: 10
      },
      qualification: String,
      areaofInteres: Array,
      picUrl: String,
      userName: String,
      password:{
        type:String,
        required: true,
        minlength:3
    },
      password2:{
          type:String,
          required: false,
          minlength:3

      },
      token:{
          type: String
      },
      following : {
        count: Number,
        ids: []
      },
      followers : {
        count: Number,
        ids: []
      },
      stories : {
        count: Number,
        ids: []
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
  var token=jwt.sign(user._id.toHexString(),confiq.SECRET);

  user.token=token;
  user.save(function(err,user){
      if(err) return cb(err);
      cb(null,user);
  })
});

// find by token
schema.statics.findByToken=function(token,cb){
  console.log(token, "calling user for token", confiq);
  var user=this;

  jwt.verify(token,confiq.SECRET,function(err,decode){
      user.findOne({"_id": decode, "token":token},function(err,user){
          if(err) return cb(err);
          cb(null,user);
      })
  })
};

//delete token

schema.method("deleteToken", function(token,cb){
  var user=this;

  user.update({$unset : {token :1}},function(err,user){
      if(err) return cb(err);
      cb(null,user);
  });
  console.log("Delete token--",user);
});

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Users = mongoose.model("users", schema);
  return Users;
};

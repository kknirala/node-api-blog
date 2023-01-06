module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      id: String,
      name: {
        type: String,
        required: false
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
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
      createdBy:{
        type: String
      },
      stories:  {
        type: Array,
        default: []
      },
      qualification: String,
      areaofInteres: Array
      },
      { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.pre('save',function(next){
    if(!this.trial){
      //do your job here
  }
  next();
  });

  // find by token
schema.statics.findByEmailAndUpdate=function(email,cb){
  var user=this;
      user.findOne({"email": email},function(err,user){
        console.log('find by toke',user)
          if(err) return cb(err);
          cb(null,user);
      })
};
  

  const GuestUsers = mongoose.model("guestuser", schema);
  return GuestUsers;
};

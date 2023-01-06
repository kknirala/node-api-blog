module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      
      feedId: {
        type: String,
        required: true
      },
      isDeleted:{
        type: Boolean,
        default: false
      },
      sections: [{
        id: String,
        html: {
          type: String,
          required: true
        },
        published:  {
          type: Boolean,
          default: false
        },
        picUrl: String,
        isDeleted:  {
          type: Boolean,
          default: false
        },
        createdBy:  {
          type: String,
          default: 'guest'
        },
        deletedBy:  {
          type: String
        },
        modifiedBy:  {
          type: String
        },
        Comment: String
      }]
    },
    { timestamps: true }
  );

  // const { __v, _id, ...object } = this.toObject();
  // object.id = _id;
  // return object;

//   schema.method("toJSON", function() {
//     let { __v, _id, ...object} = this.sections[0].toObject();
//     object.id = _id;
//   return object;
// });

  schema.method("toJSON", function() {
    let object = {feedId:this.feedId, sections: [], isDeleted: this.isDeleted};
    this.sections.forEach((elt, index) => {
      let { __v, _id, ...obj} = elt.toObject();
      obj.id = _id;
      object.sections.push(obj);
    });
    return object;
  });

  

  const FeedSections = mongoose.model("gcsections", schema);
  return FeedSections;
};

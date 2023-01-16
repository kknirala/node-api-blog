// const Sections = require("/feeds.sections");
// const feed = require('../schemas/feed.schema.js');

module.exports = mongoose => {
  var feedschema = mongoose.Schema(
    {
      id: String,
      title: {
        type: String,
        required: true
      },
      desc: String,
      html: {
        type: String,
        required: true
      },
      published: {
        type: Boolean,
        default: false
      },
      titlPic: String,
      isDeleted: {
        type: Boolean,
        default: false
      },
      createdBy: {
        type: String,
        default: "guest"
      },
      modifiedBy: {
        type: String,
        default: "guest"
      },
      likes:  {
        type: Number,
        default: 0
      },
      dislikes:  {
        type: Number,
        default: 0
      },
      views:  {
        type: Number,
        default: 0
      },
      votes: {
        type: Number,
        default: 0
      },
      publishedSec: {
        type: Number,
        default: 0
      },
      unpublishedSec: {
        type: Number,
        default: 0
      }
      // ,
      // sections: {
      //   type: Array,
      //   default: []
      // }
    },
    { timestamps: true }
  );

  feedschema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  return mongoose.model("gcfeeds", feedschema); 
};
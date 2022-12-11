// const Sections = require("/feeds.sections");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      id: String,
      title: String,
      desc: String,
      html: String,
      published: Boolean,
      titlPic: String,
      isDeleted: Boolean,
      createdBy: String,
      modifiedBy: String,
      likes: Number,
      dislikes: Number,
      views: Number,
      votes: Number,
      sections: Array
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Feeds = mongoose.model("feeds", schema);
  return Feeds;
};

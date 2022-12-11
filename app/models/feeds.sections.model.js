module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      id: String,
      desc: String,
      published: Boolean,
      picUrl: String,
      isDeleted: Boolean,
      createdBy: Object,
      deletedBy: Object,
      modifiedBy: Object
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const FeedSections = mongoose.model("feeds.sections", schema);
  return FeedSections;
};

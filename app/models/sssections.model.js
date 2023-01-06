module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      id: String,
      feedId: {
        type: String,
        required: true
      },
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
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const FeedSections = mongoose.model("sssections", schema);
  return FeedSections;
};

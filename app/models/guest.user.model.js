module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      id: String,
      name: String,
      email: String,
      phone: String,
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

  const GuestUsers = mongoose.model("guest.users", schema);
  return GuestUsers;
};

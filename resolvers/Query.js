const { photos, users } = require("../dataset.js");

module.exports = {
  totalPhotos: (parent, args, { db }) => db.collection("photos").estimatedDocumentCount,
  allPhotos: (parent, args, { db }) => db.collection("photo").find().toArray(),
  totalUsers: (parent, args, { db }) => db.collection("users").estimatedDocumentCount,
  allUsers: (parent, args, { db }) => db.collection("users").find().toArray(),
};

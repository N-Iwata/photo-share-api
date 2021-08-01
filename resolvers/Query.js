const { photos, users } = require("../dataset.js");

module.exports = {
  totalPhotos: () => 42,
  allPhotos: () => photos,
  allUsers: () => users,
};

module.exports = {
  users: [
    {
      githubLogin: "aaaaaa",
      name: "Mike",
    },
    {
      githubLogin: "bbbbbb",
      name: "Jane",
    },
    {
      githubLogin: "cccccc",
      name: "Scot",
    },
  ],
  photos: [
    {
      id: "1",
      name: "photo 1",
      description: "",
      category: "ACTION",
      githubUser: "aaaaaa",
      created: "3-28-1977",
    },
    {
      id: "2",
      name: "photo 2",
      description: "",
      category: "SELFIE",
      githubUser: "aaaaaa",
      created: "1-2-1985",
    },
    {
      id: "3",
      name: "photo 3",
      description: "",
      category: "LANDSCAPE",
      githubUser: "bbbbbb",
      created: "2018-04-15T19:09:57.308Z",
    },
  ],
  tags: [
    { photoID: "1", userID: "aaaaaa" },
    { photoID: "2", userID: "bbbbbb" },
    { photoID: "2", userID: "bbbbbb" },
    { photoID: "2", userID: "cccccc" },
  ],
};

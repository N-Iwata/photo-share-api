const { GraphQLScalarType } = require("graphql");
const { ApolloServer } = require(`apollo-server`);

const typeDefs = `
  scalar DateTime
  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }
  type User {
    githubLogin: ID!
    name: String
    avater: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }
  input PostPhotoInput {
    name: String!
    category: PhotoCategory = PORTRAIT
    description: String
  }
  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
    allUsers: [User!]!
  }
  type Mutation {
    postPhoto(input: PostPhotoInput): Photo!
  }
`;

let _id = 0;
const users = [
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
];
const photos = [
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
];

const tags = [
  { photoID: "1", userID: "aaaaaa" },
  { photoID: "2", userID: "bbbbbb" },
  { photoID: "2", userID: "bbbbbb" },
  { photoID: "2", userID: "cccccc" },
];

const resolvers = {
  Query: {
    totalPhotos: () => 42,
    allPhotos: () => photos,
    allUsers: () => users,
  },
  Mutation: {
    postPhoto(parent, args) {
      const newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date(),
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: (parent) => {
      return users.find((u) => u.githubLogin === parent.githubUser);
    },
    taggedUsers: (parent) =>
      tags
        .filter((tag) => tag.photoID === parent.id)
        .map((tag) => tag.userID)
        .map((userID) => users.find((u) => u.githubLogin === userID)),
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    inPhotos: (parent) =>
      tags
        .filter((tag) => tag.userID === parent.id)
        .map((tag) => tag.photoID)
        .map((photoID) => photos.find((p) => p.id === photoID)),
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value",
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => ast.value,
  }),
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));

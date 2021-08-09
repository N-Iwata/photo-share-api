const { authorizeWithGithub } = require("../lib.js");
const { photos } = require("../dataset.js");
const { default: fetch } = require("node-fetch");

let _id = 0;

module.exports = {
  async postPhoto(parent, args, { db, currentUser }) {
    // コンテキストにユーザーがいなければエラー
    if (!currentUser) {
      throw new Error("only an authorized user can post a photo");
    }

    // 現在のユーザーのIDとphotoを保存する
    const newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date(),
    };

    // 新しいphotoを追加して、データベースが生成したIDを取得する
    const { insertedIds } = await db.collection("photos").insert(newPhoto);
    newPhoto.id = insertedIds[0];

    return newPhoto;
  },
  async githubAuth(parent, { code }, { db }) {
    // GitHubからデータを取得する
    const { message, access_token, avatar_url, login, name } = await authorizeWithGithub({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    });

    // メッセージがある場合は何らかのエラーが発生している
    if (message) {
      throw new Error(message);
    }

    // データを一つのオブジェクトにまとめる
    const latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    };
    console.log("db: ", db);

    // 新しい情報をもとにレコードを追加したり更新する
    const {
      ops: [user],
    } = await db
      .collection("users")
      .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });

    // ユーザーデータとトークンを返す
    return { user, token: access_token };
  },
  addFakeUsers: async (parent, { count }, { db }) => {
    const randomUserApi = `https://randomuser.me/api/?results=${count}`;

    const { results } = await fetch(randomUserApi).then((res) => res.json());

    const users = results.map((r) => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail,
      githubToken: r.login.sha1,
    }));

    await db.collection("users").insert(users);

    return users;
  },
  async fakeUserAuth(parent, { githubLogin }, { db }) {
    const user = await db.collection("users").findOne({ githubLogin });

    if (!user) {
      throw new Error(`Cannot find user with githubLogin "${githubLogin}"`);
    }

    return {
      token: user.githubToken,
      user,
    };
  },
};

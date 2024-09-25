const { Sequelize } = require("sequelize");
const createAudio = require("./modelAudio");
const createCategories = require("./modelCategories");
const creatModelUser = require("./modelUser");

const creatModelTuTruyen = require("./modelTuTruyen");
const creatModelAuCa = require("./modelAuCa");
const creatModelCountView = require("./modelCountViews");

const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER_DATABASE,
  process.env.PASSWORD_DATABASE,
  {
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    host: process.env.HOST_DATABASE,
    dialect: process.env.DIALECT_DATABASE,
    timezone: process.env.TIMEZONE,
  }
);
const Categorie = createCategories(sequelize);
const Audio = createAudio(sequelize);
const User = creatModelUser(sequelize);

const CountView = creatModelCountView(sequelize);
const TuTruyen = creatModelTuTruyen(sequelize);
const AuCa = creatModelAuCa(sequelize);
module.exports = {
  sequelize,
  Audio,
  Categorie,
  User,
  AuCa,
  CountView,
  TuTruyen,
};

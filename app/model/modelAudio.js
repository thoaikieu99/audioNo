const { DataTypes } = require("sequelize");

const createAudio = (sequelize) => {
  const Audio = sequelize.define(
    "Audio",
    {
      date: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      modified: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
      },

      trang_thai: {
        type: DataTypes.INTEGER,
      },

      link_audio: {
        type: DataTypes.TEXT,
      },
      sotap: {
        type: DataTypes.INTEGER,
      },
      image: {
        type: DataTypes.STRING(100),
        defaultValue: "nonImage.jpg",
      },
      metalink: {
        type: DataTypes.STRING(100),
      },
    },
    {
      tableName: "Audios",
      timestamps: false,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    }
  );

  return Audio;
};

module.exports = createAudio;

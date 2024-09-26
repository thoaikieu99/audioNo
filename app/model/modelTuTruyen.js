const { DataTypes } = require("sequelize");

const creatModelTuTruyen = (sequelize) => {
  const TuTruyen = sequelize.define(
    "TuTruyen",
    {
      recaudio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rectile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startspeed: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startime: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      lastt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      curr: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "TuTruyens",
      timestamps: true,
    }
  );
  let Audio = sequelize.model("Audio");
  let User = sequelize.model("User");

  TuTruyen.belongsTo(Audio, { foreignKey: "audio_id", onDelete: "cascade" });
  TuTruyen.belongsTo(User, { foreignKey: "user_id", onDelete: "cascade" });
  return TuTruyen;
};
module.exports = creatModelTuTruyen;

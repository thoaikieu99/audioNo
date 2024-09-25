const { DataTypes } = require("sequelize");

const creatModelCountView = (sequelize) => {
  const CountView = sequelize.define(
    "CountView",
    {
      countViewsD: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dayView: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      countViewsM: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mouthView: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      countViewsY: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      yearView: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "CountViews",
      timestamps: false,
    }
  );
  let Audio = sequelize.model("Audio");
  Audio.hasMany(CountView, { foreignKey: "audio_id" });
  CountView.belongsTo(Audio, { foreignKey: "audio_id" });
  return CountView;
};
module.exports = creatModelCountView;

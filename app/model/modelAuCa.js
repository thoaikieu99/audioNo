const { DataTypes } = require("sequelize");

const creatModelAuCa = (sequelize) => {
  const AuCa = sequelize.define(
    "Auca",
    {},
    {
      tableName: "Aucas",
      timestamps: false,
    }
  );
  let Audio = sequelize.model("Audio");
  let Categorie = sequelize.model("Categorie");

  Audio.belongsToMany(Categorie, { through: AuCa, foreignKey: "audio_id" });
  Categorie.belongsToMany(Audio, { through: AuCa, foreignKey: "categorie_id" });

  return AuCa;
};
module.exports = creatModelAuCa;

const { DataTypes } = require("sequelize");

const createCategories = (sequelize) => {
  const Categories = sequelize.define(
    "Categorie",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      show: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "Categories",
      timestamps: false,
    }
  );

  return Categories;
};

module.exports = createCategories;

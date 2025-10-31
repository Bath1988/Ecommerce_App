module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define("review", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    itemName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    reviewText: {
      type: Sequelize.STRING,
      allowNull: false
    },
    stars: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });
  return Review;
};
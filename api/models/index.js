const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.category = require("./category.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.review = require("./review.model.js")(sequelize, Sequelize);

// Relationships
db.category.hasMany(db.product, { foreignKey: 'categoryId' });
db.product.belongsTo(db.category, { foreignKey: 'categoryId' });

db.product.hasMany(db.order, { foreignKey: 'productId' });
db.order.belongsTo(db.product, { foreignKey: 'productId' });

db.product.hasMany(db.review, { foreignKey: 'productId' });
db.review.belongsTo(db.product, { foreignKey: 'productId' });

db.order.hasMany(db.review, { foreignKey: 'orderId' });
db.review.belongsTo(db.order, { foreignKey: 'orderId' });

module.exports = db;
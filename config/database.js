const Sequelize = require("sequelize");

// Option 1: Passing parameters separately
const db = new Sequelize(
  process.env.DB_HOST,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = db;

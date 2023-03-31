const { Sequelize } = require('sequelize');
// ---------------------
// Old Config
// ---------------------
//  db = new Sequelize('express_react', 'root', '', {
//     host: "localhost",
//     dialect: "mysql"
// });
//  Sequelize = require('sequelize');
//  conn = {};

// -------------------------------------------------
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT
});

module.exports = db;

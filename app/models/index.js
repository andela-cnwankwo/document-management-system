require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../settings/config.json')[env];

const db = {};
const basename = path.basename(module.filename);

const sequelize = (process.end.NODE_ENV === 'production')
  ? new Sequelize(process.env.DATABASE_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME,
  process.env.DB_PASSWORD, config);

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0)
    && (file !== basename)
    && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

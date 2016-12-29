// Specify models to synchronize
const env = process.env.NODE_ENV || 'test',
  config = require('../settings/config.json')[env],
  Sequelize = require('sequelize'),

  // Initialize Sequelize with test configurations.
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host, dialect: config.dialect
  });

require('../app/models/user')(sequelize, Sequelize);
require('../app/models/role')(sequelize, Sequelize);
require('../app/models/doc')(sequelize, Sequelize);

sequelize.sync({ force: true });


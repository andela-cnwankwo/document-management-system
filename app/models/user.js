module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    name: DataTypes.JSON,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    roleId: { type: DataTypes.STRING, defaultValue: 2 }
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};

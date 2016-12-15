module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    name: DataTypes.JSON,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    roleId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate(models) {
        // associations
        User.belongsTo(models.Role, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE',
        });

        User.hasMany(models.Doc, {
          foreignKey: 'ownerId',
        });
      }
    }
  });
  return User;
};

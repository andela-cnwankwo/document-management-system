module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // associations
        Role.hasMany(models.User, {
          foreignKey: 'roleId',
        });
      }
    }
  });
  return Role;
};

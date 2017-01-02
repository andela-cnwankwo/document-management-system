module.exports = (sequelize, DataTypes) => {
  const Doc = sequelize.define('Doc', {
    published: DataTypes.STRING,
    title: DataTypes.STRING,
    access: {
      type: DataTypes.STRING,
      defaultValue: 'public'
    },
    content: DataTypes.TEXT,
    ownerId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        // associations
        Doc.belongsTo(models.User, {
          foreignKey: 'ownerId',
          onDelete: 'CASCADE',
        });
        Doc.belongsTo(models.User, {
          foreignKey: 'ownerRoleId',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return Doc;
};

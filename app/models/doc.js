module.exports = (sequelize, DataTypes) => {
  const Doc = sequelize.define('Doc', {
    published: DataTypes.DATE,
    access: DataTypes.STRING,
    content: DataTypes.STRING,
    ownerId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        // associations
        Doc.belongsTo(models.User, {
          foreignKey: 'ownerId',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return Doc;
};

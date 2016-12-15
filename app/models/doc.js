module.exports = (sequelize, DataTypes) => {
  const Doc = sequelize.define('Doc', {
    published: DataTypes.DATE,
    title: DataTypes.STRING,
    access: {
      type: DataTypes.STRING,
      defaultValue: 'public'
    },
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

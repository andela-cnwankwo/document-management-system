module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Docs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    published: {
      type: Sequelize.STRING,
      defaultValue: Date()
    },
    title: {
      type: Sequelize.STRING
    },
    access: {
      type: Sequelize.STRING,
      defaultValue: 'public'
    },
    content: {
      type: Sequelize.TEXT
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    ownerId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'ownerId',
      },
    },
    ownerRoleId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Roles',
        key: 'id',
        as: 'ownerRoleId',
      },
    },
  }),
  down: queryInterface => queryInterface.dropTable('Docs')
};

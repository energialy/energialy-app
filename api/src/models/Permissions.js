const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Permissions', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Unique permission identifier'
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Human readable permission name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed description of what this permission allows'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Category to group permissions (e.g., company, tenders, messages)'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};

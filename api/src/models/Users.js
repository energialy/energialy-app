const { DataTypes } = require('sequelize');

// Exporting the function that defines the model
module.exports = (sequelize) => {
  sequelize.define('Users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    resetToken: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'superAdmin', 'bank', 'company_owner', 'company_collaborator'],
      allowNull: false,
      defaultValue: 'admin',
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Array of permissions for company collaborators'
    },
    invitedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of the user who invited this collaborator'
    },
    invitationStatus: {
      type: DataTypes.ENUM,
      values: ['pending', 'accepted', 'rejected'],
      defaultValue: 'accepted',
      comment: 'Status of the invitation for collaborators'
    },
    invitationToken: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Token for invitation verification'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};

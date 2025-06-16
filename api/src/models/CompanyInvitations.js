const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('CompanyInvitations', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    invitationToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      comment: 'Array of permissions to be granted to the invited user'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'accepted', 'rejected', 'expired'],
      defaultValue: 'pending',
    },
    invitedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'ID of the company owner who sent the invitation'
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'ID of the company the user is invited to'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'First name provided by the inviter'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Last name provided by the inviter'
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Position/role provided by the inviter'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => {
        const date = new Date();
        date.setDate(date.getDate() + 7); // Expires in 7 days
        return date;
      },
    },
  });
};

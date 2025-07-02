const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TenderInvitations = sequelize.define('TenderInvitations', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Tenders',
        key: 'id',
      },
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true, // Null si es invitación por email a usuario no registrado
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    isRegistered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('invited', 'viewed', 'proposal_sent', 'declined'),
      defaultValue: 'invited',
    },
    invitedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'TenderInvitations',
    timestamps: true,
  });

  return TenderInvitations;
};

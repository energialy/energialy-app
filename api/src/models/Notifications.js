const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Notifications = sequelize.define('Notifications', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM([
      'CHAT_MESSAGE',
      'NEW_ACCOUNT',
      'TENDER_PUBLISHED',
      'PROPOSAL_RECEIVED',
      'PROPOSAL_ACCEPTED',
      'CONTRACT_AWARDED',
      'TENDER_COMPLETED',
      'TENDER_CANCELLED',
      'BANK_ACCOUNT_APPROVED',
      'BANK_ACCOUNT_REJECTED',
      'FINANCE_PRODUCT_REQUESTED',
      'FINANCE_PRODUCT_APPROVED',
      'FINANCE_PRODUCT_REJECTED',
      'GENERAL'
    ]),
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  relatedId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID of related entity (tender, proposal, etc.)'
  },
  relatedType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Type of related entity (tender, proposal, message, etc.)'
  },
  priority: {
    type: DataTypes.ENUM(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    defaultValue: 'MEDIUM',
  },
  emailSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional data for the notification'
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['type'] },
    { fields: ['isRead'] },
    { fields: ['createdAt'] },
    { fields: ['userId', 'isRead'] },
  ]
});

module.exports = Notifications;

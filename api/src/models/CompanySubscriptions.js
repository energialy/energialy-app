const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('CompanySubscriptions', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id'
      },
      comment: 'ID de la empresa'
    },
    subscriptionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Subscriptions',
        key: 'id'
      },
      comment: 'ID del plan de suscripción'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Fecha de inicio de la suscripción'
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Fecha de fin de la suscripción'
    },
    status: {
      type: DataTypes.ENUM('active', 'pending', 'expired', 'cancelled'),
      allowNull: false,
      defaultValue: 'active',
      comment: 'Estado de la suscripción'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Si la suscripción está activa'
    },
    autoRenew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si se renueva automáticamente'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      comment: 'Método de pago utilizado'
    },
    transactionId: {
      type: DataTypes.STRING,
      comment: 'ID de la transacción de pago'
    },
    notes: {
      type: DataTypes.TEXT,
      comment: 'Notas adicionales'
    },
  });
};

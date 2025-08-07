const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Subscriptions', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nombre del plan de suscripción'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Descripción del plan'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Precio del plan'
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      comment: 'Moneda del precio'
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      comment: 'Duración en días'
    },
    maxTenders: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      comment: 'Número máximo de licitaciones permitidas'
    },
    maxProposals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      comment: 'Número máximo de propuestas permitidas'
    },
    hasDocumentManagement: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Incluye gestión de documentos'
    },
    hasAdvancedReporting: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Incluye reportes avanzados'
    },
    hasPrioritySupport: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Incluye soporte prioritario'
    },
    features: {
      type: DataTypes.TEXT,
      comment: 'Lista de características separadas por coma'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Si el plan está activo para nuevas suscripciones'
    },
  });
};

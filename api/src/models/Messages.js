const { DataTypes } = require('sequelize');

// Exporting the function that defines the model
module.exports = (sequelize) => {
  sequelize.define('Messages', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // senderId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // receiverId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  });
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reservation = sequelize.define(
    'Reservation',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'rooms', key: 'id' },
      },
      startDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'CANCELED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
    },
    {
      tableName: 'reservations',
      timestamps: true,
    }
  );

  Reservation.associate = (models) => {
    Reservation.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
    });
    Reservation.belongsTo(models.Room, {
      foreignKey: 'roomId',
      as: 'Room',
    });
  };

  return Reservation;
};

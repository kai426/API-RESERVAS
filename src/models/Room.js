const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Room = sequelize.define(
    'Room',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Nome é obrigatório' },
        },
      },
      type: {
        type: DataTypes.ENUM('SALA', 'LABORATORIO', 'AUDITORIO'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['SALA', 'LABORATORIO', 'AUDITORIO']],
            msg: 'Tipo inválido. Use: SALA, LABORATORIO ou AUDITORIO',
          },
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [1], msg: 'Capacidade deve ser maior que zero' },
        },
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Localização é obrigatória' },
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'rooms',
      timestamps: true,
    }
  );

  Room.associate = (models) => {
    Room.hasMany(models.Reservation, {
      foreignKey: 'roomId',
      as: 'reservations',
    });
  };

  return Room;
};

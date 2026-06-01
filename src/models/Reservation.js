const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Reservation = sequelize.define('Reservation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        resourceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Data de início é obrigatória' },
            },
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Data de término é obrigatória' },
            },
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PENDING',
        },
        observations: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
        {
            tableName: 'reservations',
            timestamps: true,
        },
    );

    Reservation.associate = (models) => {
        Reservation.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    };

    return Reservation;
};

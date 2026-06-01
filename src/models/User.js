const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
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
                len: { args: [2, 100], msg: 'Nome deve ter entre 2 e 100 caracteres' },
            },
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: { msg: 'E-mail já cadastrado' },
            validate: {
                isEmail: { msg: 'Formato de e-mail inválido' },
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'USER'),
            allowNull: false,
            defaultValue: 'USER',
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
        {
            tableName: 'users',
            timestamps: true,
            defaultScope: {
                attributes: { exclude: ['password'] },
            },
            scopes: {
                withPassword: {
                    attributes: { include: ['password'] },
                },
            },
        },
    );

    User.associate = (models) => {
        User.hasMany(models.Reservation, {
            foreignKey: 'userId',
            as: 'reservations',
        });
    };

    return User;
}
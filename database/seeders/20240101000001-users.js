'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hashedAdmin = await bcrypt.hash('admin123', 12);
    const hashedUser = await bcrypt.hash('user123', 12);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Administrador',
        email: 'admin@reservas.com',
        password: hashedAdmin,
        role: 'ADMIN',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Usuário Padrão',
        email: 'user@reservas.com',
        password: hashedUser,
        role: 'USER',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: ['admin@reservas.com', 'user@reservas.com'],
    });
  },
};

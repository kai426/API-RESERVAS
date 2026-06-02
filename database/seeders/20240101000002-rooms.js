'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('rooms', [
      {
        name: 'Sala 101',
        type: 'SALA',
        capacity: 30,
        location: 'Bloco A, 1º Andar',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sala 201',
        type: 'SALA',
        capacity: 40,
        location: 'Bloco A, 2º Andar',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Laboratório de Informática 1',
        type: 'LABORATORIO',
        capacity: 25,
        location: 'Bloco B, Térreo',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Laboratório de Química',
        type: 'LABORATORIO',
        capacity: 20,
        location: 'Bloco C, 1º Andar',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Auditório Principal',
        type: 'AUDITORIO',
        capacity: 200,
        location: 'Bloco D, Térreo',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rooms', null, {});
  },
};

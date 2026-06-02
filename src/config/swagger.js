const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de Reservas',
      version: '1.0.0',
      description:
        'API RESTful completa para gerenciamento de reservas de salas, laboratórios e auditórios institucionais.',
      contact: {
        name: 'Suporte',
        email: 'suporte@instituicao.edu.br',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Informe o token JWT no formato: Bearer {token}',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Descrição do erro' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        UserRole: {
          type: 'string',
          enum: ['ADMIN', 'USER'],
        },
        RoomType: {
          type: 'string',
          enum: ['SALA', 'LABORATORIO', 'AUDITORIO'],
        },
        ReservationStatus: {
          type: 'string',
          enum: ['ACTIVE', 'CANCELED'],
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { $ref: '#/components/schemas/UserRole' },
            active: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Room: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            type: { $ref: '#/components/schemas/RoomType' },
            capacity: { type: 'integer' },
            location: { type: 'string' },
            active: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            roomId: { type: 'integer' },
            startDateTime: { type: 'string', format: 'date-time' },
            endDateTime: { type: 'string', format: 'date-time' },
            status: { $ref: '#/components/schemas/ReservationStatus' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            User: { $ref: '#/components/schemas/User' },
            Room: { $ref: '#/components/schemas/Room' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);

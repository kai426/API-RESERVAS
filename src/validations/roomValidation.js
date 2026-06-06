const ApiError = require('../utils/ApiError');

const VALID_TYPES = ['SALA', 'LABORATORIO', 'AUDITORIO'];

const validateCreate = (req, res, next) => {
  const { name, type, capacity, location } = req.body;

  if (!name || name.trim().length < 2) {
    throw ApiError.badRequest('Nome é obrigatório');
  }

  if (!type || !VALID_TYPES.includes(type)) {
    throw ApiError.badRequest(`Tipo inválido. Use: ${VALID_TYPES.join(', ')}`);
  }

  if (!capacity || isNaN(capacity) || parseInt(capacity) < 1) {
    throw ApiError.badRequest('Capacidade deve ser um número positivo');
  }

  if (!location || location.trim().length < 2) {
    throw ApiError.badRequest('Localização é obrigatória');
  }

  next();
};

const validateUpdate = (req, res, next) => {
  const { type, capacity } = req.body;

  if (type && !VALID_TYPES.includes(type)) {
    throw ApiError.badRequest(`Tipo inválido. Use: ${VALID_TYPES.join(', ')}`);
  }

  if (capacity !== undefined && (isNaN(capacity) || parseInt(capacity) < 1)) {
    throw ApiError.badRequest('Capacidade deve ser um número positivo');
  }

  next();
};

module.exports = { validateCreate, validateUpdate };

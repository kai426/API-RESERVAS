const ApiError = require('../utils/ApiError');

const validateCreate = (req, res, next) => {
  const { roomId, startDateTime, endDateTime } = req.body;

  if (!roomId || isNaN(roomId)) {
    throw ApiError.badRequest('roomId é obrigatório e deve ser um número');
  }

  if (!startDateTime) {
    throw ApiError.badRequest('startDateTime é obrigatório');
  }

  if (!endDateTime) {
    throw ApiError.badRequest('endDateTime é obrigatório');
  }

  if (isNaN(Date.parse(startDateTime))) {
    throw ApiError.badRequest('startDateTime inválido');
  }

  if (isNaN(Date.parse(endDateTime))) {
    throw ApiError.badRequest('endDateTime inválido');
  }

  next();
};

module.exports = { validateCreate };

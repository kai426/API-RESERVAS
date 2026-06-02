const ApiError = require('../utils/ApiError');

/**
 * Middleware de validação genérico.
 * Recebe uma função de validação que retorna { error } (estilo Joi).
 */
const validate = (schemaFn, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const { error } = schemaFn(data);
    if (error) {
      throw ApiError.badRequest(error.message);
    }
    next();
  };
};

module.exports = validate;

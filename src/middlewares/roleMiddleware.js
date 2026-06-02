const ApiError = require('../utils/ApiError');

/**
 * Middleware factory para verificar roles.
 * Uso: roleMiddleware('ADMIN') ou roleMiddleware('ADMIN', 'USER')
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Usuário não autenticado');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Acesso restrito. Roles permitidas: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

module.exports = roleMiddleware;

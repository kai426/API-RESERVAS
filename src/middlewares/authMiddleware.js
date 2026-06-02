const { verifyToken } = require('../utils/jwtUtils');
const ApiError = require('../utils/ApiError');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Token de autenticação não fornecido');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token expirado');
    }
    throw ApiError.unauthorized('Token inválido');
  }
};

module.exports = authMiddleware;

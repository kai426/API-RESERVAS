const ApiError = require('../utils/ApiError');

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2) {
        throw ApiError.badRequest('Nome é obrigatório e deve ter no mínimo 2 caracteres');
    }

    if (!email || !validateEmail(email)) {
        throw ApiError.badRequest('E-mail inválido');
    }

    if (!password || password.length < 6) {
        throw ApiError.badRequest('Senha deve ter no mínimo 6 caracteres');
    }

    const allowedRoles = ['ADMIN', 'USER'];
    if (req.body.role && !allowedRoles.includes(req.body.role)) {
        throw ApiError.badRequest(`Role inválida. Use: ${allowedRoles.join(' ou ')}`);
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !validateEmail(email)) {
        throw ApiError.badRequest('E-mail inválido');
    }

    if (!password) {
        throw ApiError.badRequest('Senha é obrigatória');
    }

    next();
};

module.exports = { validateRegister, validateLogin };

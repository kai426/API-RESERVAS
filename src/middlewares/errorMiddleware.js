const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
    console.error(`[ERROR] ${err.name}: ${err.message}`);

    // Erros conhecidos da aplicação
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Erros de validação do Sequelize
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map((e) => e.message).join('; ');
        return res.status(400).json({
            success: false,
            message: messages,
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            message: 'Registro duplicado: ' + err.errors.map((e) => e.message).join('; '),
        });
    }

    if (err.name === 'SequelizeDatabaseError') {
        return res.status(400).json({
            success: false,
            message: 'Erro de banco de dados: ' + err.message,
        });
    }

    // Erro genérico
    return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
    });
};

module.exports = errorMiddleware;

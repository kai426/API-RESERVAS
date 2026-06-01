class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message) {
        return new ApiError(message, 400);
    }

    static unauthorized(message = 'Não autorizado') {
        return new ApiError(message, 401);
    }

    static forbidden(message = 'Acesso negado') {
        return new ApiError(message, 403);
    }

    static notFound(message = 'Recurso não encontrado') {
        return new ApiError(message, 404);
    }

    static conflict(message) {
        return new ApiError(message, 409);
    }

    static internal(message = 'Erro interno do servidor') {
        return new ApiError(message, 500);
    }
}

module.exports = ApiError;

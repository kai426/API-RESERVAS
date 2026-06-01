const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwtUtils');
const userRepository = require('../repositories/userRepository');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

class AuthService {
    async register({ name, email, password, role = 'USER' }) {
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            throw ApiError.conflict('E-mail já está em uso');
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

        const user = await userRepository.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const { password: _, ...userData } = user.toJSON();

        return { user: userData };
    }

    async login({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw ApiError.unauthorized('Credenciais inválidas');
        }

        if (!user.active) {
            throw ApiError.unauthorized('Conta desativada. Entre em contato com o administrador');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw ApiError.unauthorized('Credenciais inválidas');
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        const { password: _, ...userData } = user.toJSON();

        return { user: userData, token };
    }
};

module.exports = new AuthService();
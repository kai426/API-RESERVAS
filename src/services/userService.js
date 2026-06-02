const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

class UserService {
  async findAll(query) {
    return userRepository.findAll(query);
  }

  async findById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound('Usuário não encontrado');
    return user;
  }

  async update(id, data, requesterId, requesterRole) {
    // Apenas ADMIN pode atualizar outros usuários
    if (requesterRole !== 'ADMIN' && requesterId !== parseInt(id)) {
      throw ApiError.forbidden('Você só pode atualizar seus próprios dados');
    }

    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound('Usuário não encontrado');

    // Apenas ADMIN pode alterar role
    if (data.role && requesterRole !== 'ADMIN') {
      throw ApiError.forbidden('Apenas administradores podem alterar papéis');
    }

    // Se enviou nova senha, hashear
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    }

    // Não permitir alterar e-mail para um já existente
    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing) throw ApiError.conflict('E-mail já está em uso');
    }

    return userRepository.update(id, data);
  }

  async softDelete(id, requesterId, requesterRole) {
    if (requesterRole !== 'ADMIN' && requesterId !== parseInt(id)) {
      throw ApiError.forbidden('Acesso negado');
    }

    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound('Usuário não encontrado');

    if (!user.active) throw ApiError.badRequest('Usuário já está inativo');

    return userRepository.softDelete(id);
  }
}

module.exports = new UserService();

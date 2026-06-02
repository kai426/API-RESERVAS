const roomRepository = require('../repositories/roomRepository');
const ApiError = require('../utils/ApiError');
const { isValidRange, isPastDate } = require('../utils/dateUtils');

class RoomService {
  async findAll(query) {
    return roomRepository.findAll(query);
  }

  async findById(id) {
    const room = await roomRepository.findById(id);
    if (!room) throw ApiError.notFound('Sala não encontrada');
    return room;
  }

  async findAvailable({ start, end }) {
    if (!start || !end) {
      throw ApiError.badRequest('Parâmetros start e end são obrigatórios');
    }

    if (!isValidRange(start, end)) {
      throw ApiError.badRequest('startDateTime deve ser anterior ao endDateTime');
    }

    return roomRepository.findAvailable(start, end);
  }

  async create(data) {
    return roomRepository.create(data);
  }

  async update(id, data) {
    const room = await roomRepository.findById(id);
    if (!room) throw ApiError.notFound('Sala não encontrada');
    return roomRepository.update(id, data);
  }

  async softDelete(id) {
    const room = await roomRepository.findById(id);
    if (!room) throw ApiError.notFound('Sala não encontrada');
    if (!room.active) throw ApiError.badRequest('Sala já está inativa');
    return roomRepository.softDelete(id);
  }
}

module.exports = new RoomService();

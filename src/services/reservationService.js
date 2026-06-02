const reservationRepository = require('../repositories/reservationRepository');
const roomRepository = require('../repositories/roomRepository');
const ApiError = require('../utils/ApiError');
const {
  isPastDate,
  isWithinBusinessHours,
  isValidRange,
  OPENING_HOUR,
  CLOSING_HOUR,
} = require('../utils/dateUtils');

class ReservationService {
  async findAll(query) {
    return reservationRepository.findAll(query);
  }

  async findByUser(userId, query) {
    return reservationRepository.findByUser(userId, query);
  }

  async findByRoom(roomId, query) {
    const room = await roomRepository.findById(roomId);
    if (!room) throw ApiError.notFound('Sala não encontrada');
    return reservationRepository.findByRoom(roomId, query);
  }

  async create({ userId, roomId, startDateTime, endDateTime }) {
    // 1. Validar range temporal
    if (!isValidRange(startDateTime, endDateTime)) {
      throw ApiError.badRequest('O início deve ser anterior ao fim da reserva');
    }

    // 2. Impedir datas passadas
    if (isPastDate(startDateTime)) {
      throw ApiError.badRequest('Não é possível criar reservas em datas passadas');
    }

    // 3. Validar horário de funcionamento (07:00 - 22:00)
    if (!isWithinBusinessHours(startDateTime, endDateTime)) {
      throw ApiError.badRequest(
        `Reservas permitidas apenas entre ${OPENING_HOUR}:00 e ${CLOSING_HOUR}:00`
      );
    }

    // 4. Verificar se a sala existe e está ativa
    const room = await roomRepository.findById(roomId);
    if (!room) throw ApiError.notFound('Sala não encontrada');
    if (!room.active) throw ApiError.badRequest('Esta sala está inativa');

    // 5. Verificar conflito de horários
    const conflicts = await reservationRepository.findConflicts(
      roomId,
      startDateTime,
      endDateTime
    );

    if (conflicts.length > 0) {
      throw ApiError.conflict(
        'Já existe uma reserva ativa para esta sala neste período'
      );
    }

    return reservationRepository.create({ userId, roomId, startDateTime, endDateTime });
  }

  async cancel(id, requesterId, requesterRole) {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) throw ApiError.notFound('Reserva não encontrada');

    if (reservation.status === 'CANCELED') {
      throw ApiError.badRequest('Esta reserva já foi cancelada');
    }

    // USER só pode cancelar as próprias reservas
    if (requesterRole !== 'ADMIN' && reservation.userId !== requesterId) {
      throw ApiError.forbidden('Você só pode cancelar suas próprias reservas');
    }

    return reservationRepository.cancel(id);
  }
}

module.exports = new ReservationService();

const { Op } = require('sequelize');
const { Reservation, User, Room } = require('../models');

const includeAssociations = [
  {
    model: User,
    as: 'User',
    attributes: ['id', 'name', 'email'],
  },
  {
    model: Room,
    as: 'Room',
    attributes: ['id', 'name', 'type', 'location'],
  },
];

class ReservationRepository {
  async findAll({ page = 1, limit = 10, status } = {}) {
    const offset = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Reservation.findAndCountAll({
      where,
      include: includeAssociations,
      limit: parseInt(limit),
      offset,
      order: [['startDateTime', 'ASC']],
    });

    return {
      data: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    };
  }

  async findByUser(userId, { page = 1, limit = 10, status } = {}) {
    const offset = (page - 1) * limit;
    const where = { userId };
    if (status) where.status = status;

    const { count, rows } = await Reservation.findAndCountAll({
      where,
      include: includeAssociations,
      limit: parseInt(limit),
      offset,
      order: [['startDateTime', 'ASC']],
    });

    return {
      data: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    };
  }

  async findByRoom(roomId, { page = 1, limit = 10, status } = {}) {
    const offset = (page - 1) * limit;
    const where = { roomId };
    if (status) where.status = status;

    const { count, rows } = await Reservation.findAndCountAll({
      where,
      include: includeAssociations,
      limit: parseInt(limit),
      offset,
      order: [['startDateTime', 'ASC']],
    });

    return {
      data: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    };
  }

  async findById(id) {
    return Reservation.findByPk(id, { include: includeAssociations });
  }

  /**
   * Busca reservas ATIVAS que conflitam com o intervalo dado para uma sala
   */
  async findConflicts(roomId, startDateTime, endDateTime, excludeId = null) {
    const where = {
      roomId,
      status: 'ACTIVE',
      startDateTime: { [Op.lt]: new Date(endDateTime) },
      endDateTime: { [Op.gt]: new Date(startDateTime) },
    };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    return Reservation.findAll({ where });
  }

  async create(data) {
    return Reservation.create(data);
  }

  async cancel(id) {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) return null;
    return reservation.update({ status: 'CANCELED' });
  }
}

module.exports = new ReservationRepository();

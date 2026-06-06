const { Op } = require('sequelize');
const { Room, Reservation } = require('../models');

class RoomRepository {
  async findAll({ page = 1, limit = 10, type, active = true } = {}) {
    const offset = (page - 1) * limit;
    const where = {};
    if (active !== undefined) where.active = active;
    if (type) where.type = type;

    const { count, rows } = await Room.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['name', 'ASC']],
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
    return Room.findByPk(id);
  }

  async findAvailable(startDateTime, endDateTime) {
    // Rooms that have NO active conflicting reservations in the given window
    const conflictingRoomIds = await Reservation.findAll({
      where: {
        status: 'ACTIVE',
        startDateTime: { [Op.lt]: new Date(endDateTime) },
        endDateTime: { [Op.gt]: new Date(startDateTime) },
      },
      attributes: ['roomId'],
      raw: true,
    });

    const busyIds = conflictingRoomIds.map((r) => r.roomId);

    const where = { active: true };
    if (busyIds.length > 0) {
      where.id = { [Op.notIn]: busyIds };
    }

    return Room.findAll({ where, order: [['name', 'ASC']] });
  }

  async create(data) {
    return Room.create(data);
  }

  async update(id, data) {
    const room = await Room.findByPk(id);
    if (!room) return null;
    return room.update(data);
  }

  async softDelete(id) {
    const room = await Room.findByPk(id);
    if (!room) return null;
    return room.update({ active: false });
  }
}

module.exports = new RoomRepository();

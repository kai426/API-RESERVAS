const { User } = require('../models');

class UserRepository {
  async findAll({ page = 1, limit = 10, active } = {}) {
    const offset = (page - 1) * limit;
    const where = {};
    if (active !== undefined) where.active = active;

    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
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
    return User.findByPk(id);
  }

  async findByEmail(email) {
    return User.scope('withPassword').findOne({ where: { email } });
  }

  async create(data) {
    return User.create(data);
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update(data);
  }

  async softDelete(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update({ active: false });
  }
}

module.exports = new UserRepository();

const roomService = require('../services/roomService');

class RoomController {
  async findAll(req, res) {
    const result = await roomService.findAll(req.query);
    return res.status(200).json({ success: true, data: result });
  }

  async findAvailable(req, res) {
    const rooms = await roomService.findAvailable(req.query);
    return res.status(200).json({ success: true, data: rooms });
  }

  async findById(req, res) {
    const room = await roomService.findById(req.params.id);
    return res.status(200).json({ success: true, data: room });
  }

  async create(req, res) {
    const room = await roomService.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Sala criada com sucesso',
      data: room,
    });
  }

  async update(req, res) {
    const room = await roomService.update(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Sala atualizada com sucesso',
      data: room,
    });
  }

  async softDelete(req, res) {
    await roomService.softDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Sala desativada com sucesso',
    });
  }
}

module.exports = new RoomController();

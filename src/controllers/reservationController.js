const reservationService = require('../services/reservationService');

class ReservationController {
  async findAll(req, res) {
    const result = await reservationService.findAll(req.query);
    return res.status(200).json({ success: true, data: result });
  }

  async findMine(req, res) {
    const result = await reservationService.findByUser(req.user.id, req.query);
    return res.status(200).json({ success: true, data: result });
  }

  async findByRoom(req, res) {
    const result = await reservationService.findByRoom(req.params.roomId, req.query);
    return res.status(200).json({ success: true, data: result });
  }

  async create(req, res) {
    const reservation = await reservationService.create({
      ...req.body,
      userId: req.user.id,
    });
    return res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso',
      data: reservation,
    });
  }

  async cancel(req, res) {
    const reservation = await reservationService.cancel(
      req.params.id,
      req.user.id,
      req.user.role
    );
    return res.status(200).json({
      success: true,
      message: 'Reserva cancelada com sucesso',
      data: reservation,
    });
  }
}

module.exports = new ReservationController();

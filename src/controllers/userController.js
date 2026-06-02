const userService = require('../services/userService');

class UserController {
  async findAll(req, res) {
    const result = await userService.findAll(req.query);
    return res.status(200).json({ success: true, data: result });
  }

  async findById(req, res) {
    const user = await userService.findById(req.params.id);
    return res.status(200).json({ success: true, data: user });
  }

  async update(req, res) {
    const user = await userService.update(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    return res.status(200).json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: user,
    });
  }

  async softDelete(req, res) {
    await userService.softDelete(req.params.id, req.user.id, req.user.role);
    return res.status(200).json({
      success: true,
      message: 'Usuário desativado com sucesso',
    });
  }
}

module.exports = new UserController();

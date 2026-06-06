const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    const user = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: user,
    });
  }

  async login(req, res) {
    const result = await authService.login(req.body);
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: result,
    });
  }
}

module.exports = new AuthController();

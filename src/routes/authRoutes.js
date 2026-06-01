const router = require('express').Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validations/authValidation');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

module.exports = router;
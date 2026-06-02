const router = require('express').Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validateCreate } = require('../validations/reservationValidation');

/**
 * @openapi
 * tags:
 *   name: Reservations
 *   description: Gerenciamento de reservas
 */

/**
 * @openapi
 * /reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Listar todas as reservas (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CANCELED]
 *     responses:
 *       200:
 *         description: Lista paginada de reservas
 *       403:
 *         description: Acesso restrito a administradores
 */
router.get('/', authMiddleware, roleMiddleware('ADMIN'), reservationController.findAll);

/**
 * @openapi
 * /reservations/my:
 *   get:
 *     tags: [Reservations]
 *     summary: Listar minhas reservas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CANCELED]
 *     responses:
 *       200:
 *         description: Minhas reservas
 */
router.get('/my', authMiddleware, reservationController.findMine);

/**
 * @openapi
 * /reservations/room/{roomId}:
 *   get:
 *     tags: [Reservations]
 *     summary: Listar reservas de uma sala (agenda)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CANCELED]
 *     responses:
 *       200:
 *         description: Agenda da sala
 *       404:
 *         description: Sala não encontrada
 */
router.get('/room/:roomId', authMiddleware, reservationController.findByRoom);

/**
 * @openapi
 * /reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Criar nova reserva
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roomId, startDateTime, endDateTime]
 *             properties:
 *               roomId:
 *                 type: integer
 *                 example: 1
 *               startDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-15T09:00:00.000Z"
 *               endDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-15T11:00:00.000Z"
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *       400:
 *         description: Dados inválidos ou restrição de horário
 *       409:
 *         description: Conflito de horário com reserva existente
 */
router.post('/', authMiddleware, validateCreate, reservationController.create);

/**
 * @openapi
 * /reservations/{id}:
 *   delete:
 *     tags: [Reservations]
 *     summary: Cancelar reserva
 *     description: USER cancela apenas as próprias reservas. ADMIN cancela qualquer uma.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Reserva cancelada com sucesso
 *       403:
 *         description: Sem permissão para cancelar esta reserva
 *       404:
 *         description: Reserva não encontrada
 */
router.delete('/:id', authMiddleware, reservationController.cancel);

module.exports = router;

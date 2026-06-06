const router = require('express').Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validateCreate, validateUpdate } = require('../validations/roomValidation');

/**
 * @openapi
 * tags:
 *   name: Rooms
 *   description: Gerenciamento de salas, laboratórios e auditórios
 */

/**
 * @openapi
 * /rooms/available:
 *   get:
 *     tags: [Rooms]
 *     summary: Listar salas disponíveis em um período
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema: { type: string, format: date-time }
 *         example: "2025-08-15T09:00:00.000Z"
 *       - in: query
 *         name: end
 *         required: true
 *         schema: { type: string, format: date-time }
 *         example: "2025-08-15T11:00:00.000Z"
 *     responses:
 *       200:
 *         description: Salas disponíveis
 */
router.get('/available', authMiddleware, roomController.findAvailable);

/**
 * @openapi
 * /rooms:
 *   get:
 *     tags: [Rooms]
 *     summary: Listar todas as salas
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [SALA, LABORATORIO, AUDITORIO]
 *       - in: query
 *         name: active
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista paginada de salas
 */
router.get('/', authMiddleware, roomController.findAll);

/**
 * @openapi
 * /rooms/{id}:
 *   get:
 *     tags: [Rooms]
 *     summary: Buscar sala por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados da sala
 *       404:
 *         description: Sala não encontrada
 */
router.get('/:id', authMiddleware, roomController.findById);

/**
 * @openapi
 * /rooms:
 *   post:
 *     tags: [Rooms]
 *     summary: Criar nova sala (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, capacity, location]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sala 101
 *               type:
 *                 $ref: '#/components/schemas/RoomType'
 *               capacity:
 *                 type: integer
 *                 example: 30
 *               location:
 *                 type: string
 *                 example: Bloco A, 1º Andar
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *       403:
 *         description: Acesso restrito a administradores
 */
router.post('/', authMiddleware, roleMiddleware('ADMIN'), validateCreate, roomController.create);

/**
 * @openapi
 * /rooms/{id}:
 *   put:
 *     tags: [Rooms]
 *     summary: Atualizar sala (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               type: { $ref: '#/components/schemas/RoomType' }
 *               capacity: { type: integer }
 *               location: { type: string }
 *               active: { type: boolean }
 *     responses:
 *       200:
 *         description: Sala atualizada
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Sala não encontrada
 */
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), validateUpdate, roomController.update);

/**
 * @openapi
 * /rooms/{id}:
 *   delete:
 *     tags: [Rooms]
 *     summary: Desativar sala (ADMIN, soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Sala desativada
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Sala não encontrada
 */
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), roomController.softDelete);

module.exports = router;

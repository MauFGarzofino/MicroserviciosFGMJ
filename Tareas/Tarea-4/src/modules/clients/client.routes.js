import { Router } from 'express';
import { list, getOne, create, update, remove, listByClient } from './client.controller.js';
import { validate, createClientSchema, updateClientSchema } from './client.validators.js';

const router = Router();

/**
 * @swagger
 * /clients:
 *   get:
 *     tags: [Clients]
 *     summary: Listar clientes con paginación
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *         description: Número de página (empieza en 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Lista de clientes paginada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page: { type: integer }
 *                 limit: { type: integer }
 *                 total: { type: integer }
 *                 totalPages: { type: integer }
 *                 items:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Client' }
 *             example:
 *               page: 1
 *               limit: 10
 *               total: 2
 *               totalPages: 1
 *               items:
 *                 - _id: "68b9ef8e10775f6f270e4827"
 *                   ci: "10394235"
 *                   firstName: "User"
 *                   lastName: "Test"
 *                   sex: "F"
 *                   createdAt: "2025-09-05T01:28:39.937Z"
 *                   updatedAt: "2025-09-05T01:28:39.937Z"
 */
router.get('/', list);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Obtener cliente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Client' }
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', getOne);

/**
 * @swagger
 * /clients:
 *   post:
 *     tags: [Clients]
 *     summary: Crear cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateClientDto' }
 *           # (opcional) ejemplo reutilizable:
 *           # examples:
 *           #   default:
 *           #     value:
 *           #       ci: "12345678"
 *           #       firstName: "Mauro"
 *           #       lastName: "Guzmán"
 *           #       sex: "M"
 *     responses:
 *       201:
 *         description: Creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Client' }
 *       409:
 *         description: CI ya registrado
 *       422:
 *         description: Datos de entrada inválidos
 */
router.post('/', validate(createClientSchema), create);

/**
 * @swagger
 * /clients/{id}:
 *   patch:
 *     tags: [Clients]
 *     summary: Actualizar cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateClientDto' }
 *           # (opcional) ejemplo de body parcial:
 *           # examples:
 *           #   changeName:
 *           #     value: { firstName: "Carlos" }
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Client' }
 *       400:
 *         description: ID de cliente inválido
 *       404:
 *         description: Cliente no encontrado
 *       422:
 *         description: Datos de entrada inválidos
 */
router.patch('/:id', validate(updateClientSchema), update);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     tags: [Clients]
 *     summary: Eliminar cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', remove);

/**
 * @swagger
 * /clients/{clientId}/invoices:
 *   get:
 *     tags: [Invoices]    # puedes dejar [Clients] si prefieres
 *     summary: Listar facturas por cliente (paginado)
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema: { type: string }
 *         description: ID del cliente
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *         description: Número de página (empieza en 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *         description: Registros por página (máx. 100)
 *     responses:
 *       200:
 *         description: Lista paginada de facturas del cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedInvoiceResponse'
 *       400:
 *         description: ID de cliente inválido
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:clientId/invoices', listByClient);
export default router;

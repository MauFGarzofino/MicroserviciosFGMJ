import { Router } from 'express';
import { list, getOne, create, update, remove } from './invoice.controller.js';
import { validate, createInvoiceSchema, updateInvoiceSchema } from './invoice.validators.js';

const router = Router();

/**
 * @swagger
 * /invoices:
 *   get:
 *     tags: [Invoices]
 *     summary: Listar facturas con paginación
 *     parameters:
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
 *         description: Lista paginada de facturas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedInvoiceResponse'
 *             example:
 *               page: 1
 *               limit: 10
 *               total: 1
 *               totalPages: 1
 *               items:
 *                 - _id: "68ba2c5e596af42acd162e85"
 *                   date: "2025-09-05T00:00:00.000Z"
 *                   client:
 *                     _id: "68b9ef8e10775f6f270e4827"
 *                     ci: "10394235"
 *                     firstName: "user"
 *                     lastName: "test"
 *                     sex: "F"
 *                   details:
 *                     - _id: "68ba31a2dff4c4d79dd97b34"
 *                       product:
 *                         _id: "68b9b35021cfb6408376326b"
 *                         name: "Servilletas"
 *                         brand: "Scott"
 *                       quantity: 12
 *                       unitPrice: 10
 *                   createdAt: "2025-09-05T00:18:38.513Z"
 *                   updatedAt: "2025-09-05T00:42:33.484Z"
 *                   __v: 1
 */
router.get('/', list);

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     tags: [Invoices]
 *     summary: Obtener factura por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Factura encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Invoice' }
 *             example:   # <- ejemplo explícito
 *               _id: "68ba2c5e596af42acd162e85"
 *               date: "2025-09-05T00:00:00.000Z"
 *               client:
 *                 _id: "68b9ef8e10775f6f270e4827"
 *                 ci: "10394235"
 *                 firstName: "user"
 *                 lastName: "test"
 *                 sex: "F"
 *                 id: "68b9ef8e10775f6f270e4827"
 *               details:
 *                 - _id: "68ba31a2dff4c4d79dd97b34"
 *                   product:
 *                     _id: "68b9b35021cfb6408376326b"
 *                     name: "Servilletas"
 *                     brand: "Scott"
 *                     id: "68b9b35021cfb6408376326b"
 *                   quantity: 12
 *                   unitPrice: 10
 *                   id: "68ba31a2dff4c4d79dd97b34"
 *               createdAt: "2025-09-05T00:18:38.513Z"
 *               updatedAt: "2025-09-05T00:42:33.484Z"
 *               __v: 1
 *               total: 120
 *               id: "68ba2c5e596af42acd162e85"
 *       400:
 *         description: ID de factura inválido
 *       404:
 *         description: Factura no encontrada
 */
router.get('/:id', getOne);

/**
 * @swagger
 * /invoices:
 *   post:
 *     tags: [Invoices]
 *     summary: Crear factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateInvoiceDto' }
 *     responses:
 *       201:
 *         description: Creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Invoice' }
 *       400:
 *         description: Cliente inválido
 */
router.post('/', validate(createInvoiceSchema), create);

/**
 * @swagger
 * /invoices/{id}:
 *   patch:
 *     tags: [Invoices]
 *     summary: Actualizar factura
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateInvoiceDto' }
 *     responses:
 *       200:
 *         description: Factura actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Invoice' }
 *       400:
 *         description: Cliente inválido
 *       404:
 *         description: Factura no encontrada
 */
router.patch('/:id', validate(updateInvoiceSchema), update);

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     tags: [Invoices]
 *     summary: Eliminar factura
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura eliminada
 *       404:
 *         description: Factura no encontrada
 */
router.delete('/:id', remove);

export default router;

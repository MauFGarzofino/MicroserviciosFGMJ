import { Router } from 'express';
import { list, add, update, remove } from './invoice-detail.controller.js';
import { validate, createDetailSchema, updateDetailSchema } from './invoice-detail.validators.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /invoices/{invoiceId}/details:
 *   get:
 *     tags: [InvoiceDetails]
 *     summary: Listar detalles de una factura
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema: { type: string }
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Lista de detalles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/InvoiceDetail' }
 *             example:
 *               - _id: "68ba31a2dff4c4d79dd97b34"
 *                 product:
 *                   _id: "68b9b35021cfb6408376326b"
 *                   name: "Servilletas"
 *                   brand: "Scott"
 *                 quantity: 12
 *                 unitPrice: 10
 *       404:
 *         description: Factura no encontrada
 */
router.get('/', list);

/**
 * @swagger
 * /invoices/{invoiceId}/details:
 *   post:
 *     tags: [InvoiceDetails]
 *     summary: Agregar detalle a la factura
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema: { type: string }
 *         description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateInvoiceDetailDto' }
 *           examples:
 *             default:
 *               $ref: '#/components/examples/CreateInvoiceDetailBody'
 *     responses:
 *       201:
 *         description: Detalle creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InvoiceDetail' }
 *             examples:
 *               populated:
 *                 $ref: '#/components/examples/InvoiceDetailPopulated'
 *       400:
 *         description: ID de factura inválido o producto inválido
 *       404:
 *         description: Factura no encontrada
 *       422:
 *         description: Datos de entrada inválidos
 */
router.post('/', validate(createDetailSchema), add);

/**
 * @swagger
 * /invoices/{invoiceId}/details/{detailId}:
 *   patch:
 *     tags: [InvoiceDetails]
 *     summary: Actualizar un detalle de la factura
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: detailId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateInvoiceDetailDto' }
 *     responses:
 *       200:
 *         description: Detalle actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InvoiceDetail' }
 *       400:
 *         description: Producto inválido
 *       404:
 *         description: Factura o detalle no encontrado
 */
router.patch('/:detailId', validate(updateDetailSchema), update);

/**
 * @swagger
 * /invoices/{invoiceId}/details/{detailId}:
 *   delete:
 *     tags: [InvoiceDetails]
 *     summary: Eliminar un detalle de la factura
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: detailId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Detalle eliminado
 *       404:
 *         description: Factura o detalle no encontrado
 */
router.delete('/:detailId', remove);
export default router;

import { Router } from 'express';
import products from '../modules/products/product.routes.js';
import clients from '../modules/clients/client.routes.js';
import invoices from '../modules/invoices/invoice.routes.js';
import invoiceDetails from '../modules/invoice-details/invoice-detail.routes.js';

const router = Router();

router.use('/products', products);
router.use('/clients', clients);
router.use('/invoices', invoices);
router.use('/invoices/:invoiceId/details', invoiceDetails);

export default router;

import { Router } from 'express';
import workers from '../modules/worker/worker.routes.js';

const router = Router();

router.use('/workers', workers);

export default router;

import { Router } from 'express';
import {
    createAgenda,
    listAgenda,
    getAgenda,
    updateAgenda,
    deleteAgenda
} from './controller.js';

const router = Router();

router.post('/', createAgenda);
router.get('/', listAgenda);
router.get('/:id', getAgenda);
router.put('/:id', updateAgenda);
router.delete('/:id', deleteAgenda);

export default router;

import { Router } from 'express';
import { AppDataSource } from '../database/db';
import { Agenda } from '../entities/Agenda';

const router = Router();
const repo = () => AppDataSource.getRepository(Agenda);

// Listado
router.get('/', async (_req, res) => {
    const result = await repo().find({ order: { id: 'ASC' } });
    res.render('index', { result });
});

// Form crear
router.get('/contactos/create', (_req, res) => {
    res.render('create');
});

// Guardar (POST)
router.post('/contactos', async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    const agenda = repo().create({ nombres, apellidos, fecha_nacimiento, direccion, celular, correo });
    await repo().save(agenda);
    res.redirect('/');
});

// Form editar
router.get('/contactos/:id/edit', async (req, res) => {
    const agenda = await repo().findOneBy({ id: Number(req.params.id) });
    if (!agenda) return res.status(404).send('No encontrado');
    res.render('edit', { agenda });
});

// Actualizar
router.put('/contactos/:id', async (req, res) => {
    const id = Number(req.params.id);
    await repo().update({ id }, req.body);
    res.redirect('/');
});

// Borrar
router.delete('/contactos/:id', async (req, res) => {
    const id = Number(req.params.id);
    await repo().delete({ id });
    res.redirect('/');
});

export default router;

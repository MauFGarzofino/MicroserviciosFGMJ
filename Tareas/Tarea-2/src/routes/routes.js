const { Router } = require('express');
const { AgendaModel } = require('../models/Agenda');

const router = Router();

// Listar
router.get('/', async (_req, res, next) => {
    try {
        const result = await AgendaModel.find().sort({ _id: 1 }).lean({ virtuals: true });
        res.render('index', { result });
    } catch (err) { next(err); }
});

// Form crear
router.get('/contactos/create', (_req, res) => {
    res.render('create');
});

// Crear (POST)
router.post('/contactos', async (req, res, next) => {
    try {
        const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
        await AgendaModel.create({ nombres, apellidos, fecha_nacimiento, direccion, celular, correo });
        res.redirect('/');
    } catch (err) { next(err); }
});

// Form editar
router.get('/contactos/:id/edit', async (req, res, next) => {
    try {
        const agenda = await AgendaModel.findById(req.params.id).lean({ virtuals: true });
        if (!agenda) return res.status(404).send('No encontrado');
        res.render('edit', { agenda });
    } catch (err) { next(err); }
});

// Actualizar
router.put('/contactos/:id', async (req, res, next) => {
    try {
        const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
        await AgendaModel.findByIdAndUpdate(
            req.params.id,
            { nombres, apellidos, fecha_nacimiento, direccion, celular, correo },
            { runValidators: true }
        );
        res.redirect('/');
    } catch (err) { next(err); }
});

// Eliminar
router.delete('/contactos/:id', async (req, res, next) => {
    try {
        await AgendaModel.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) { next(err); }
});

module.exports = router;

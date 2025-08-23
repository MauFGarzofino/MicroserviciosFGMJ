"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db");
const Agenda_1 = require("../entities/Agenda");
const router = (0, express_1.Router)();
const repo = () => db_1.AppDataSource.getRepository(Agenda_1.Agenda);
// Listado
router.get('/', async (_req, res) => {
    const result = await repo().find({ order: { id: 'ASC' } });
    res.render('index', { result });
});
// Form crear
router.get('/create', (_req, res) => {
    res.render('create');
});
// Guardar (POST)
router.post('/save', async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    const agenda = repo().create({ nombres, apellidos, fecha_nacimiento, direccion, celular, correo });
    await repo().save(agenda);
    res.redirect('/');
});
// Form editar
router.get('/edit/:id', async (req, res) => {
    const agenda = await repo().findOneBy({ id: Number(req.params.id) });
    if (!agenda)
        return res.status(404).send('No encontrado');
    res.render('edit', { agenda });
});
// Actualizar (PUT con method-override)
router.put('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    await repo().update({ id }, req.body);
    res.redirect('/');
});
// Borrar (DELETE con method-override)
router.delete('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    await repo().delete({ id });
    res.redirect('/');
});
exports.default = router;

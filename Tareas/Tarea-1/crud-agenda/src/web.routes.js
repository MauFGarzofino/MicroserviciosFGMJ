import { Router } from 'express';
import { pool } from './db.js';

const router = Router();

// Listar
router.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM agenda ORDER BY id DESC');
    res.render('index', { result: rows });
});

// Form crear
router.get('/create', (req, res) => res.render('create'));

// Guardar
router.post('/save', async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    await pool.query(
        `INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo)
     VALUES ($1,$2,$3,$4,$5,$6)`,
        [nombres, apellidos, fecha_nacimiento, direccion, celular, correo]
    );
    res.redirect('/');
});

// Form editar
router.get('/edit/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM agenda WHERE id=$1', [req.params.id]);
    res.render('edit', { agenda: rows[0] });
});

// Actualizar
router.post('/update/:id', async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    await pool.query(
        `UPDATE agenda SET nombres=$1, apellidos=$2, fecha_nacimiento=$3,
     direccion=$4, celular=$5, correo=$6, updated_at=NOW() WHERE id=$7`,
        [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, req.params.id]
    );
    res.redirect('/');
});

// Eliminar
router.post('/delete/:id', async (req, res) => {
    await pool.query('DELETE FROM agenda WHERE id=$1', [req.params.id]);
    res.redirect('/');
});

export default router;

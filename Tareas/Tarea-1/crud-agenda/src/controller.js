import { pool } from './db.js';

// Crear agenda
export async function createAgenda(req, res) {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [nombres, apellidos, fecha_nacimiento, direccion, celular, correo]
        );
        return res.status(201).json(rows[0]);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

// Recuperar todas las agendas
export async function listAgenda(_req, res) {
    try {
        const { rows } = await pool.query(`SELECT * FROM agenda ORDER BY id DESC`);
        return res.json(rows);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

// Recuperar una agenda por ID
export async function getAgenda(req, res) {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(`SELECT * FROM agenda WHERE id = $1`, [id]);
        if (!rows.length) return res.status(404).json({ message: 'No encontrado' });
        return res.json(rows[0]);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

// Actualizar agenda
export async function updateAgenda(req, res) {
    const { id } = req.params;
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    try {
        const { rows } = await pool.query(
            `UPDATE agenda
       SET nombres=$1, apellidos=$2, fecha_nacimiento=$3, direccion=$4, celular=$5, correo=$6, updated_at=NOW()
       WHERE id=$7
       RETURNING *`,
            [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, id]
        );
        if (!rows.length) return res.status(404).json({ message: 'No encontrado' });
        return res.json(rows[0]);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

// Eliminar agenda
export async function deleteAgenda(req, res) {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query(`DELETE FROM agenda WHERE id=$1`, [id]);
        if (!rowCount) return res.status(404).json({ message: 'No encontrado' });
        return res.status(204).send();
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

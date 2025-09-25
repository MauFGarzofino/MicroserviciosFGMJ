import Worker from '../../models/worker.model.js';

export async function list(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const items = await Worker.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Worker.countDocuments();

        console.log(items)
        console.log(total)

        res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            items,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener trabajadores', error: err.message });
    }
}

export async function getOne(req, res) {
    const item = await Worker.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Trabajadores no encontrado' });
    res.json(item);
}
export async function create(req, res) {
    const item = await Worker.create(req.body);
    res.status(201).json(item);
}
export async function update(req, res) {
    const item = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(item);
}
export async function remove(req, res) {
    const item = await Worker.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Trabajador no encontrado' });
    res.json({ message: 'Trabajador eliminado' });
}

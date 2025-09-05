import Product from '../../models/product.model.js';

export async function list(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product.countDocuments(),
        ]);

        res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            items,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al listar productos', error: err.message });
    }
}
export async function getOne(req, res) {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(item);
}
export async function create(req, res) {
    const item = await Product.create(req.body);
    res.status(201).json(item);
}
export async function update(req, res) {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(item);
}
export async function remove(req, res) {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
}

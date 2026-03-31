const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/inventory
const getAll = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(products);
    } catch (e) {
        res.status(500).json({ message: 'Error al obtener inventario.', error: e.message });
    }
};

// POST /api/inventory — solo ADMIN
const create = async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'No autorizado para crear equipos.' });
    }
    const { name, category, stock } = req.body;
    try {
        const product = await prisma.product.create({
            data: {
                name,
                category: category || 'General',
                stock: Number(stock) || 0
            }
        });
        res.status(201).json(product);
    } catch (e) {
        res.status(400).json({ message: 'Error al crear equipo.', error: e.message });
    }
};

// PUT /api/inventory/:id — ADMIN y COORDINADOR
const update = async (req, res) => {
    const allowedRoles = ['ADMIN', 'COORDINADOR'];
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'No autorizado para editar stock.' });
    }
    const { name, category, stock } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: Number(req.params.id) },
            data: { 
                name, 
                category: category || 'General', 
                stock: Number(stock) 
            }
        });
        res.json(product);
    } catch (e) {
        res.status(500).json({ message: 'Error al actualizar equipo.', error: e.message });
    }
};

// DELETE /api/inventory/:id — solo ADMIN
const remove = async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'No autorizado para eliminar activos.' });
    }
    try {
        await prisma.product.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: 'Equipo eliminado con éxito.' });
    } catch (e) {
        res.status(500).json({ message: 'Error al eliminar.', error: e.message });
    }
};

module.exports = { getAll, create, update, remove };

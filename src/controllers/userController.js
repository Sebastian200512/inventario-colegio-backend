const { PrismaClient } = require('@prisma/client');
const bcrypt           = require('bcrypt');

const prisma = new PrismaClient();

// GET /api/users  — solo ADMIN y COORDINADOR
const getAll = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true }
        });
        res.json(users);
    } catch (e) {
        res.status(500).json({ message: 'Error al obtener usuarios.', error: e.message });
    }
};

// POST /api/users  — solo ADMIN
const create = async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'No autorizado.' });
    }
    const { name, email, password, role } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hash, role: role || 'DOCENTE' }
        });
        res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (e) {
        res.status(400).json({ message: 'Error al crear usuario. El correo puede ya existir.', error: e.message });
    }
};

// PUT /api/users/:id  — solo ADMIN
const update = async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'No autorizado.' });
    }
    const { name, role } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: { name, role },
            select: { id: true, name: true, email: true, role: true }
        });
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: 'Error al actualizar usuario.', error: e.message });
    }
};

// DELETE /api/users/:id  — solo ADMIN
const remove = async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'No autorizado.' });
    }
    try {
        await prisma.user.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: 'Usuario eliminado.' });
    } catch (e) {
        res.status(500).json({ message: 'Error al eliminar usuario.', error: e.message });
    }
};

module.exports = { getAll, create, update, remove };

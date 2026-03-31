const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/loans - Listado Real con Estados de PostgreSQL
const getAll = async (req, res) => {
    try {
        const { role, id } = req.user;
        let loans;
        
        const includeData = {
            user: { select: { name: true } },
            product: { select: { name: true } }
        };

        if (role === 'ADMIN' || role === 'COORDINADOR') {
            loans = await prisma.loan.findMany({ 
                include: includeData,
                orderBy: { loanDate: 'desc' } // Más recientes primero
            });
        } else {
            loans = await prisma.loan.findMany({ 
                where: { userId: id },
                include: includeData,
                orderBy: { loanDate: 'desc' }
            });
        }

        const formattedLoans = loans.map(loan => ({
            id: loan.id,
            professor: loan.user?.name || 'Docente Invitado',
            equipment: loan.product?.name || 'Equipo General',
            date: loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : 'Sin fecha',
            // OJO: Respetamos el campo EXACTO de la base de datos
            status: loan.status 
        }));

        res.json(formattedLoans);
    } catch (e) {
        res.status(500).json({ message: 'Error al obtener préstamos.', error: e.message });
    }
};

const create = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        const loan = await prisma.loan.create({
            data: {
                userId: Number(userId),
                productId: Number(productId),
                loanDate: new Date(),
                status: 'Pendiente' // Todo nace como PENDIENTE
            }
        });
        res.status(201).json(loan);
    } catch (e) {
        res.status(400).json({ message: 'Error al solicitar.', error: e.message });
    }
};

const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { role } = req.user;

    if (role !== 'ADMIN' && role !== 'COORDINADOR') {
        return res.status(403).json({ message: 'Acceso denegado.' });
    }

    try {
        const loan = await prisma.loan.findUnique({ where: { id: Number(id) } });

        if (status === 'Aprobado') {
            await prisma.product.update({
                where: { id: loan.productId },
                data: { stock: { decrement: 1 } }
            });
        } else if (status === 'Devuelto') {
            await prisma.product.update({
                where: { id: loan.productId },
                data: { stock: { increment: 1 } }
            });
        }

        await prisma.loan.update({
            where: { id: Number(id) },
            data: { status }
        });

        res.json({ message: `Préstamo ${status} correctamente.` });
    } catch (e) {
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

module.exports = { getAll, create, updateStatus };

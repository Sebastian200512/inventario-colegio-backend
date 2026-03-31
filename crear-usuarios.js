const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('colegio2026', 10);

    // 1. Coordinador
    const coord = await prisma.user.upsert({
        where: { email: 'coordinador@colegio.edu.co' },
        update: { role: 'COORDINADOR' },
        create: {
            email: 'coordinador@colegio.edu.co',
            name: 'Coord. Juan Perez',
            password: passwordHash,
            role: 'COORDINADOR',
        },
    });

    // 2. Docente
    const docente = await prisma.user.upsert({
        where: { email: 'docente@colegio.edu.co' },
        update: { role: 'DOCENTE' },
        create: {
            email: 'docente@colegio.edu.co',
            name: 'Prof. Maria Lopez',
            password: passwordHash,
            role: 'DOCENTE',
        },
    });

    console.log('--- USUARIOS DE PRUEBA CREADOS ---');
    console.log('COORD: coordinador@colegio.edu.co');
    console.log('DOCENTE: docente@colegio.edu.co');
    console.log('PASS: colegio2026');
    console.log('---------------------------------');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('colegio2026', 10);

    const user = await prisma.user.upsert({
        where: { email: 'admin@colegio.edu.co' },
        update: {},
        create: {
            email: 'admin@colegio.edu.co',
            name: 'Administrador Colegio',
            password: passwordHash,
            role: 'ADMIN',
        },
    });

    console.log('--- USUARIO CREADO CON ÉXITO ---');
    console.log('Email:', user.email);
    console.log('Password: colegio2026');
    console.log('--------------------------------');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Iniciando Siembra Total en Render ---');

    // 1. Limpieza profunda
    await prisma.loan.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✔ Base de datos en Render limpiada.');

    // 2. Crear Usuarios
    const admin = await prisma.user.create({
        data: {
            email: 'admin@colegio.edu.co',
            password: '$2b$10$Gp5MDiv3zU5r4JKxbTF5GOi2cZaRIYPsdqJDj.WH4zcfSeFOyJ56K',
            name: 'Administrador Colegio',
            role: 'ADMIN',
        }
    });

    const coordinador = await prisma.user.create({
        data: {
            email: 'coordinador@colegio.edu.co',
            password: '$2b$10$EPogaS0ozRLS160vuGrNC.pGWUCUXiw3fmkT4kbclVB5Pa63sCYbS',
            name: 'Coord. Juan Perez',
            role: 'COORDINADOR',
        }
    });

    const docente = await prisma.user.create({
        data: {
            email: 'docente@colegio.edu.co',
            password: '$2b$10$EPogaS0ozRLS160vuGrNC.pGWUCUXiw3fmkT4kbclVB5Pa63sCYbS',
            name: 'Prof. Maria Lopez',
            role: 'DOCENTE',
        }
    });
    console.log('✔ Usuarios creados.');

    // 3. Crear Productos
    const altavoz = await prisma.product.create({
        data: { name: "Altavoz", description: "Sonido", stock: 1, category: "General" }
    });

    const pc8ram = await prisma.product.create({
        data: { name: "Computador 8 Ram", description: "Computo", stock: 4, category: "General" }
    });
    console.log('✔ Productos creados.');

    // 4. Crear Préstamos (Usando loanDate)
    const loans = [
        {
            userId: docente.id,
            productId: pc8ram.id,
            loanDate: new Date("2026-03-31T19:04:38.285Z"),
            status: "Devuelto"
        },
        {
            userId: docente.id,
            productId: pc8ram.id,
            loanDate: new Date("2026-03-31T19:13:27.093Z"),
            status: "Rechazado"
        },
        {
            userId: docente.id,
            productId: altavoz.id,
            loanDate: new Date("2026-03-31T19:27:44.669Z"),
            status: "Aprobado"
        }
    ];

    for (const l of loans) {
        await prisma.loan.create({ data: l });
    }
    console.log('✔ Préstamos (Loans) migrados con éxito.');

    console.log('--- ¡Siembra TOTAL completada en Render! ---');
}

main()
    .catch((e) => {
        console.error('❌ Error en el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
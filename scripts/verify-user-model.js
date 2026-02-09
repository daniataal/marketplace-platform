const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        console.log(`Current user count: ${userCount}`);
        console.log('User model is accessible.');
    } catch (e) {
        console.error('Error accessing User model:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

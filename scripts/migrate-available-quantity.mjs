// Migration script to initialize availableQuantity for existing deals
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration: Setting availableQuantity = quantity for all existing deals...');

    const deals = await prisma.deal.findMany();

    for (const deal of deals) {
        await prisma.deal.update({
            where: { id: deal.id },
            data: { availableQuantity: deal.quantity }
        });
        console.log(`Updated deal ${deal.id}: ${deal.company} - availableQuantity set to ${deal.quantity}`);
    }

    console.log(`Migration complete. Updated ${deals.length} deals.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// Test gold price service with native fetch
import { GoldPriceService } from './src/lib/services/gold-price.js';

async function testGoldPriceService() {
    console.log('\n========== Testing GoldPriceService ==========\n');

    try {
        console.log('Attempting to fetch gold price...');
        const price = await GoldPriceService.getLivePricePerKg();
        console.log('\n✅ SUCCESS!');
        console.log(`Gold Price: $${price.toFixed(2)}/kg`);
        console.log(`Gold Price: $${(price / 32.1507466).toFixed(2)}/oz`);
    } catch (error) {
        console.error('\n❌ FAILED!');
        console.error('Error:', error);
    }

    console.log('\n=============================================\n');
}

testGoldPriceService();

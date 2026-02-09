// Native fetch is available in Node 18+

// Configuration
const MARKETPLACE_URL = 'http://localhost:3001';
const CROWDFUNDING_URL = 'http://localhost:3000';

async function verify() {
    console.log("🚀 Starting End-to-End Verification...");

    // 1. Simulate Mining Map Export
    const externalId = `mine-${Date.now()}`;
    const dealData = {
        externalId,
        company: "Test Mining Co",
        commodity: "Gold",
        quantity: 100,
        pricePerKg: 65000,
        discount: 5.0,
        status: "OPEN"
    };

    console.log(`\n🔹 Step 1: Simulating Mining Map Export (Ingest) to ${MARKETPLACE_URL}/api/v1/ingest`);
    try {
        const ingestRes = await fetch(`${MARKETPLACE_URL}/api/v1/ingest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dealData)
        });

        if (!ingestRes.ok) throw new Error(`Ingest failed: ${await ingestRes.text()}`);
        const ingestJson = await ingestRes.json();
        console.log("✅ Ingest Success:", ingestJson);
        const dealId = ingestJson.deal.id;

        // 2. Simulate User Purchase on Marketplace
        console.log(`\n🔹 Step 2: Simulating Purchase (Close Deal) for Deal ID: ${dealId}`);
        const purchaseRes = await fetch(`${MARKETPLACE_URL}/api/v1/deals/${dealId}/purchase`, {
            method: 'POST'
        });

        if (!purchaseRes.ok) throw new Error(`Purchase failed: ${await purchaseRes.text()}`);
        const purchaseJson = await purchaseRes.json();
        console.log("✅ Purchase Success:", purchaseJson);

        // 3. Verify Commodity in Crowdfunding
        console.log(`\n🔹 Step 3: Verifying Commodity created in Crowdfunding at ${CROWDFUNDING_URL}`);
        // We can filter by shipmentId which matches our dealId
        // But our GET endpoint doesn't support filtering by shipmentId yet?
        // Let's just list recent and find it.
        const commoditiesRes = await fetch(`${CROWDFUNDING_URL}/api/marketplace/commodities?limit=10`);
        if (!commoditiesRes.ok) throw new Error(`Crowdfunding check failed: ${await commoditiesRes.text()}`);

        const commoditiesJson = await commoditiesRes.json();
        const found = commoditiesJson.data.find(c => c.shipmentId === dealId);

        if (found) {
            console.log("✅ Verification SUCCESS! Found commodity in Crowdfunding:", found.id, found.name);
        } else {
            console.error("❌ Verification FAILED! Commodity not found in Crowdfunding.");
            console.log("Recent commodities:", commoditiesJson.data.map(c => ({ id: c.id, shipmentId: c.shipmentId })));
        }

    } catch (error) {
        console.error("❌ Verification Failed with Error:", error);
    }
}

verify();

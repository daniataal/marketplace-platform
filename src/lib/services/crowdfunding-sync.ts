import { prisma } from "@/lib/prisma";

export class CrowdfundingSyncService {
    static async syncDeliveryToCrowdfunding(purchaseId: string) {
        try {
            const CROWDFUNDING_API = process.env.CROWDFUNDING_API_URL || "http://localhost:3000/api/marketplace/commodities";
            console.log(`[CrowdfundingSync] Notifying crowdfunding of delivery for shipment ${purchaseId}`);

            const response = await fetch(CROWDFUNDING_API, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shipmentId: purchaseId,
                    status: "ARRIVED"
                })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`[CrowdfundingSync] Failed to sync delivery to crowdfunding: ${text}`);
            } else {
                console.log(`[CrowdfundingSync] Successfully marked shipment ${purchaseId} as ARRIVED in crowdfunding`);
            }
        } catch (error) {
            console.error('[CrowdfundingSync] Error in syncDeliveryToCrowdfunding:', error);
        }
    }

    /**
     * Re-pushes a periodic deal to the crowdfunding platform by creating a new 
     * Pending Export and a recurring Purchase record.
     */
    static async repushPeriodicDeal(lastPurchaseId: string) {
        try {
            // 1. First, mark the current one as delivered in Crowdfunding
            await this.syncDeliveryToCrowdfunding(lastPurchaseId);

            const lastPurchase = await prisma.purchase.findUnique({
                where: { id: lastPurchaseId },
                include: { deal: true }
            });

            if (!lastPurchase) {
                console.error(`[CrowdfundingSync] Purchase ${lastPurchaseId} not found`);
                return;
            }

            const { deal } = lastPurchase;
            const d = deal as any;

            // Only repush if it's a periodic deal (not SPOT)
            if (d.frequency === 'SPOT') {
                console.log(`[CrowdfundingSync] Deal ${d.id} is a SPOT deal, skipping repush.`);
                return;
            }

            console.log(`[CrowdfundingSync] Re-pushing periodic deal ${d.id} (${d.frequency}) after delivery of purchase ${lastPurchaseId}`);

            // Create a new Purchase record for the next delivery cycle
            // This represents the next tranche being opened for crowdfunding
            const nextPurchase = await prisma.purchase.create({
                data: {
                    dealId: d.id,
                    buyerId: lastPurchase.buyerId,
                    quantity: lastPurchase.quantity,
                    pricePerKg: lastPurchase.pricePerKg,
                    totalPrice: lastPurchase.totalPrice,
                    deliveryLocation: lastPurchase.deliveryLocation,
                    status: "CONFIRMED" // Automatically confirmed for the next cycle
                }
            });

            // Create a new Pending Export for the next tranche
            await (prisma as any).pendingExport.create({
                data: {
                    purchaseId: nextPurchase.id,
                    dealId: d.id,
                    cfType: d.commodity, // e.g., "Gold"
                    cfName: `${d.company} - ${d.commodity} ${d.type === 'BULLION' ? 'Bullion' : 'Dore'} (${nextPurchase.quantity}kg)`,
                    cfIcon: d.cfIcon,
                    cfRisk: d.cfRisk,
                    cfTargetApy: d.cfTargetApy,
                    cfDuration: d.cfDuration,
                    cfMinInvestment: d.cfMinInvestment,
                    cfAmountRequired: nextPurchase.totalPrice,
                    cfDescription: `Secured ${d.commodity} ${d.type === 'BULLION' ? 'Bullion' : 'Dore'} from ${d.company}. Purity: ${(d.purity * 100).toFixed(2)}%. Quantity: ${nextPurchase.quantity}kg. Delivery: ${nextPurchase.deliveryLocation}.`,
                    cfOrigin: d.cfOrigin,
                    cfDestination: nextPurchase.deliveryLocation,
                    cfTransportMethod: d.cfTransportMethod,
                    cfMetalForm: d.type === 'BULLION' ? 'Bullion' : 'Dore',
                    cfPurityPercent: d.purity * 100,
                    status: "PENDING"
                }
            });

            console.log(`[CrowdfundingSync] Created next periodic tranche export for deal ${d.id}. Shipment ID: ${nextPurchase.id}`);

        } catch (error) {
            console.error('[CrowdfundingSync] Error in repushPeriodicDeal:', error);
        }
    }
}

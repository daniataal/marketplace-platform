import { prisma } from "@/lib/prisma";

export class CrowdfundingSyncService {
    /**
     * Marks a shipment as ARRIVED in the crowdfunding platform
     */
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
     * Sends a purchase/shipment to the crowdfunding platform as a new investment opportunity
     */
    static async pushToCrowdfunding(data: {
        purchaseId: string;
        dealId: string;
        cfType: string;
        cfName: string;
        cfIcon: string;
        cfRisk: string;
        cfTargetApy: number;
        cfDuration: number;
        cfMinInvestment: number;
        cfAmountRequired: number;
        cfDescription: string;
        cfOrigin: string;
        cfDestination: string;
        cfTransportMethod: string;
        cfMetalForm: string;
        cfPurityPercent: number;
    }) {
        const CROWDFUNDING_API = process.env.CROWDFUNDING_API_URL || "http://localhost:3000/api/marketplace/commodities";

        const payload = {
            type: data.cfType,
            name: data.cfName,
            icon: data.cfIcon,
            risk: data.cfRisk,
            targetApy: data.cfTargetApy,
            duration: data.cfDuration,
            minInvestment: data.cfMinInvestment,
            amountRequired: data.cfAmountRequired,
            description: data.cfDescription,
            origin: data.cfOrigin,
            destination: data.cfDestination,
            transportMethod: data.cfTransportMethod,
            metalForm: data.cfMetalForm,
            purityPercent: data.cfPurityPercent,
            shipmentId: data.purchaseId
        };

        const response = await fetch(CROWDFUNDING_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Crowdfunding API failure: ${errorText}`);
        }

        return await response.json();
    }

    /**
     * Re-pushes a periodic deal to the crowdfunding platform if the contract is still valid
     */
    static async repushPeriodicDeal(lastPurchaseId: string) {
        try {
            // 1. Mark the current one as delivered
            await this.syncDeliveryToCrowdfunding(lastPurchaseId);

            const lastPurchase = await prisma.purchase.findUnique({
                where: { id: lastPurchaseId },
                include: { deal: true }
            });

            if (!lastPurchase) return;
            const { deal } = lastPurchase;
            const d = deal as any;

            if (d.frequency === 'SPOT') return;

            // 2. Contract Validation: Quantity check
            const allPurchases = await prisma.purchase.findMany({
                where: { dealId: d.id, status: 'DELIVERED' }
            });
            const totalDelivered = allPurchases.reduce((acc, p) => acc + p.quantity, 0);

            if (d.totalQuantity && totalDelivered >= d.totalQuantity) {
                console.log(`[CrowdfundingSync] Deal ${d.id} has reached total contract quantity (${totalDelivered}/${d.totalQuantity}). Stopping auto-repush.`);
                return;
            }

            // 3. Contract Validation: Time check
            const expiryDate = new Date(d.createdAt);
            expiryDate.setFullYear(expiryDate.getFullYear() + (d.contractDuration || 1));
            if (new Date() > expiryDate) {
                console.log(`[CrowdfundingSync] Deal ${d.id} has reached contract duration expiry. Stopping auto-repush.`);
                return;
            }

            console.log(`[CrowdfundingSync] Contract Valid (${totalDelivered}/${d.totalQuantity}kg delivered). Automating next tranche for deal ${d.id}`);

            // 4. Create new Purchase record for the next cycle
            const nextPurchase = await prisma.purchase.create({
                data: {
                    dealId: d.id,
                    buyerId: lastPurchase.buyerId,
                    quantity: lastPurchase.quantity,
                    pricePerKg: lastPurchase.pricePerKg,
                    totalPrice: lastPurchase.totalPrice,
                    deliveryLocation: lastPurchase.deliveryLocation,
                    status: "CONFIRMED"
                }
            });

            // 5. Build export data
            const exportData = {
                purchaseId: nextPurchase.id,
                dealId: d.id,
                cfType: d.commodity,
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
                cfPurityPercent: d.purity * 100
            };

            // 6. Push DIRECTLY to Crowdfunding (Automatic scaling)
            try {
                const cfResult = await this.pushToCrowdfunding(exportData);
                const cfId = cfResult?.data?.id || null;

                // Create a record in PendingExport but mark it as already EXPORTED
                await (prisma as any).pendingExport.create({
                    data: {
                        ...exportData,
                        status: "EXPORTED",
                        crowdfundingId: cfId,
                        exportedAt: new Date(),
                        reviewedBy: "SYSTEM-AUTO"
                    }
                });
                console.log(`[CrowdfundingSync] Successfully auto-pushed tranche ${nextPurchase.id} to crowdfunding.`);
            } catch (error) {
                console.error(`[CrowdfundingSync] Auto-push failed, creating PENDING export instead:`, error);
                // Fallback to manual if API is down
                await (prisma as any).pendingExport.create({
                    data: { ...exportData, status: "PENDING" }
                });
            }

        } catch (error) {
            console.error('[CrowdfundingSync] Error in repushPeriodicDeal:', error);
        }
    }
}

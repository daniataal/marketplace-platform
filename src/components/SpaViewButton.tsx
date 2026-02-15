'use client';

import React, { useState } from 'react';
import { FileText, Eye, Loader2 } from 'lucide-react';

interface SpaViewButtonProps {
    purchase: any;
    sellerConfig: any;
}

export default function SpaViewButton({ purchase, sellerConfig }: SpaViewButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePreview = async () => {
        try {
            setLoading(true);
            const { generateSpaPdfUrl } = await import('@/components/SpaPdfDocument');

            const buyerName = `${purchase.buyer?.firstName || purchase.buyer?.name || ''} ${purchase.buyer?.lastName || ''}`.trim() || 'Buyer';

            const getDeliveryCountry = () => {
                const locationMap: { [key: string]: string } = {
                    'Dubai': 'UAE',
                    'Johannesburg': 'ZAF',
                    'London': 'UK',
                    'Singapore': 'SGP',
                    'Mumbai': 'IND'
                };

                if (purchase.deliveryLocation.includes(' - ')) {
                    const baseCity = purchase.deliveryLocation.split(' - ')[0];
                    return locationMap[baseCity] || 'UAE';
                }

                return locationMap[purchase.deliveryLocation] || 'UAE';
            };

            const url = await generateSpaPdfUrl({
                DEAL_ID: purchase.deal.externalId || purchase.deal.id,
                DATE: new Date(purchase.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                SELLER_NAME: sellerConfig.companyName,
                SELLER_ADDRESS: sellerConfig.address,
                SELLER_TRADE_LICENCE: sellerConfig.tradeLicense,
                SELLER_REPRESENTATIVE: sellerConfig.representative,
                SELLER_PASSPORT_NUMBER: sellerConfig.passportNumber,
                SELLER_PASSPORT_EXPIRY: sellerConfig.passportExpiry,
                SELLER_COUNTRY: sellerConfig.country,
                SELLER_TELEPHONE: sellerConfig.telephone,
                SELLER_EMAIL: sellerConfig.email,
                BUYER_NAME: buyerName,
                BUYER_ADDRESS: purchase.buyer?.address || "[Buyer Address to be provided]",
                BUYER_TRADE_LICENCE: "[Buyer Trade Licence to be provided]",
                BUYER_REPRESENTED_BY: buyerName,
                BUYER_COUNTRY: purchase.buyer?.nationality || "[Buyer Country to be provided]",
                BUYER_TELEPHONE: "[Buyer Telephone to be provided]",
                BUYER_EMAIL: purchase.buyer?.email || "",
                AU_PURITY: `${(purchase.deal.purity || 0) * 100}%`,
                AU_FINESSE: purchase.deal.purity && purchase.deal.purity >= 0.9999 ? "24 Carat" : "+23 Carats",
                AU_ORIGIN: "Uganda",
                AU_ORIGIN_PORT: "Kampala",
                AU_DELIVERY_PORT: "DXB – Dubai International Airport",
                AU_DESTINATION: purchase.deliveryLocation,
                QUANTITY: purchase.quantity.toString(),
                PRICE: `$${purchase.deal.pricePerKg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD/kg`,
                DELIVERY_COUNTRY: getDeliveryCountry()
            });

            window.open(url, '_blank');
        } catch (e) {
            console.error(e);
            alert('Failed to generate SPA preview');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePreview}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            title="View Agreement"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <FileText className="w-4 h-4" />
            )}
            SPA
        </button>
    );
}

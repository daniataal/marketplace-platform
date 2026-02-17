'use client';

import React, { useState } from 'react';
import { FileText, Eye, Loader2, CheckCircle } from 'lucide-react';
import SpaPreviewModal from './SpaPreviewModal';
import { signPurchaseAgreement } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { generateSpaVariables } from '@/lib/spa-utils';

interface SpaViewButtonProps {
    purchase: any;
    sellerConfig: any;
}

export default function SpaViewButton({ purchase, sellerConfig }: SpaViewButtonProps) {
    const [loading, setLoading] = useState(false);
    const [signing, setSigning] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const router = useRouter();

    const isSigned = purchase.agreement?.status === 'SIGNED';

    const getSpaVariables = () => {
        // If already signed and we have saved data, use it!
        if (isSigned && purchase.agreement?.spaData) {
            return purchase.agreement.spaData;
        }

        return generateSpaVariables({
            deal: purchase.deal,
            buyer: purchase.buyer,
            sellerConfig,
            quantity: purchase?.quantity || 0,
            deliveryLocation: purchase.deliveryLocation,
            customDate: new Date(purchase.createdAt)
        });
    };

    const handlePreview = async () => {
        try {
            setLoading(true);
            const { generateSpaPdfUrl } = await import('@/components/SpaPdfDocument');
            const variables = getSpaVariables();
            const url = await generateSpaPdfUrl(variables);
            setPreviewUrl(url);
            setShowPreview(true);
        } catch (e) {
            console.error(e);
            alert('Failed to generate SPA preview');
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async () => {
        if (!confirm('Are you sure you want to sign this SPA? This will freeze the document details.')) return;

        try {
            setSigning(true);
            const variables = getSpaVariables();
            await signPurchaseAgreement(purchase.id, variables);
            alert('SPA signed and saved successfully!');
            router.refresh();
        } catch (e) {
            console.error(e);
            alert('Failed to sign SPA');
        } finally {
            setSigning(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    onClick={handlePreview}
                    disabled={loading}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${isSigned
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    title={isSigned ? "View Signed SPA" : "View Draft SPA"}
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <FileText className="w-4 h-4" />
                    )}
                    {isSigned ? 'View SPA (Signed)' : 'Preview SPA'}
                </button>

            </div>

            <SpaPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                pdfUrl={previewUrl}
                title={isSigned ? "Signed Sale & Purchase Agreement" : "Draft Sale & Purchase Agreement"}
            />
        </>
    );
}

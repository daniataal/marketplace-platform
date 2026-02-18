import React, { useState } from 'react';
import { User } from 'lucide-react';

interface SellerLogoProps {
    src?: string | null;
    companyName: string;
    className?: string;
}

export function SellerLogo({ src, companyName, className = "w-10 h-10" }: SellerLogoProps) {
    const [isError, setIsError] = useState(false);

    // Get initials for fallback
    const initials = companyName
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || '?';

    if (!src || isError) {
        return (
            <div className={`${className} bg-secondary flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground font-bold text-xs`}>
                {initials}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={companyName}
            className={`${className} object-contain rounded-lg`}
            onError={() => setIsError(true)}
        />
    );
}

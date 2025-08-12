import { useState } from 'react';

export const useTooltip = () => {
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

    const showTooltip = (position: { x: number; y: number }) => {
        setPosition(position);
    };

    const hideTooltip = () => {
        setPosition(null);
    };

    return {
        position,
        showTooltip,
        hideTooltip
    };
};

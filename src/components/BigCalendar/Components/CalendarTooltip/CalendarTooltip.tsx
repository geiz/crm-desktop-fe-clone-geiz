import cn from 'classnames';

import { useEffect, useRef, useState } from 'react';

import styles from './CalendarTooltip.module.css';

//TODO: refactor to use ./ui/Tooltip.tsx if possible

interface TooltipProps {
    position: { x: number; y: number } | null;
    children: React.ReactNode;
    hideTooltip: () => void;
    callback?: () => void;
}

type Direction = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export const CalendarTooltip: React.FC<TooltipProps> = ({ position, children, hideTooltip, callback }) => {
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [direction, setDirection] = useState<Direction>('bottom-right');

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
                hideTooltip();
                callback?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [hideTooltip, callback]);

    useEffect(() => {
        if (!position || !tooltipRef.current) return;

        const tooltipEl = tooltipRef.current;
        const tooltipRect = tooltipEl.getBoundingClientRect();
        const padding = 10;

        const spaceBottom = window.innerHeight - position.y;
        const spaceRight = window.innerWidth - position.x;

        const isTop = spaceBottom < tooltipRect.height + padding;
        const isLeft = spaceRight < tooltipRect.width + padding;

        const top = isTop ? position.y - tooltipRect.height - padding : position.y + padding;
        const left = isLeft ? position.x - tooltipRect.width + padding : position.x - 30;

        const newDirection: Direction =
            isTop && isLeft ? 'top-left' : isTop && !isLeft ? 'top-right' : !isTop && isLeft ? 'bottom-left' : 'bottom-right';

        setDirection(newDirection);
        setStyle({ top, left });
    }, [position]);

    if (!position) return null;

    return (
        <div ref={tooltipRef} className={cn(styles.tooltipContainer, styles[direction])} style={style}>
            <TooltipArrow direction={direction} />
            {children}
        </div>
    );
};

const TooltipArrow: React.FC<{ direction: Direction }> = ({ direction }) => (
    <>
        <div className={cn(styles.tooltipArrow, styles[direction])} />
        <div className={cn(styles.tooltipArrowInner, styles[direction])} />
    </>
);

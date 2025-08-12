import { TableCellProps } from './types';
import cn from 'classnames';

import { useCallback, useRef, useState } from 'react';

import { colapse, expand, formatValue } from './utils';

import styles from './Cell.module.css';

interface CellProps {
    cell: TableCellProps;
}

const Cell = ({ cell }: CellProps) => {
    // TODO: create reusable useExpand hook for another cases (if needed)
    const cellRef = useRef<HTMLDivElement | null>(null);
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();

            const el = cellRef.current;
            if (!el) return;

            if (expanded) colapse(el);
            else expand(el);

            setExpanded(prev => !prev);
        },
        [expanded]
    );

    const isCollapsible = cell.isDescription && String(cell.value).length > 80;

    return (
        <div className={cn(styles.cellWrapper)}>
            <div
                ref={cellRef}
                className={cn(styles.cell, cell.typography || 'body-12SB', {
                    [styles.expanded]: expanded,
                    [styles.collapse]: isCollapsible || cell.nowrap,
                    [styles.uppercase]: cell.format === 'uppercase',
                    [styles.lowercase]: cell.format === 'lowercase'
                })}>
                {formatValue(cell)}
            </div>
            {isCollapsible && (
                <button
                    onClick={toggleExpanded}
                    aria-label='expand/collapse text'
                    className={cn(styles.arrow, 'icomoon', 'icon-drop-down-small')}
                />
            )}
        </div>
    );
};

export default Cell;

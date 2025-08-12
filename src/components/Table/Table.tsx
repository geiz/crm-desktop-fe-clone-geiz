import TableRow from './TableRow';
import cn from 'classnames';
import isFunction from 'lodash/isFunction';

import Pagination from 'components/Pagination/Pagination';
import TableHead from 'components/Table/TableHead';
import { TableBaseItem, TableCellColumn, TableComponents } from 'components/Table/types';
import Dropdown from 'components/ui/Dropdown';

import { formatCells } from './utils';

import styles from './Table.module.css';

interface TableProps<T> {
    className?: string;
    columns: TableCellColumn[];
    data: T[];
    gridTemplateColumns: string;
    getActionsConfig?: (item: T) => { label: string; action: (item: T) => void }[];
    components?: TableComponents<T>;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
    totalItems?: number;
    scrollRef?: React.RefObject<HTMLDivElement>;
    onRowClick?: (item: T) => void;
    loadingTriggerRef?: (node?: Element | null) => void;
    hasMore?: boolean;
    showInlineLoader?: boolean;
    showPagination?: boolean;
}

const Table = <T extends TableBaseItem>({
    className,
    columns,
    data,
    gridTemplateColumns,
    getActionsConfig,
    components,
    onScroll,
    totalItems = 0,
    scrollRef,
    onRowClick,
    loadingTriggerRef,
    hasMore = false,
    showInlineLoader = false,
    showPagination = false
}: TableProps<T>) => {
    return (
        <>
            <TableHead columns={columns.map(col => col.label)} gridTemplateColumns={gridTemplateColumns} />

            <div className={cn(className, 'table-body')} onScroll={onScroll} ref={scrollRef}>
                {(data || []).map(item =>
                    components?.Row ? (
                        <components.Row key={item.id} rowData={item} />
                    ) : (
                        <TableRow
                            key={item.id}
                            cells={formatCells(item, columns)}
                            gridTemplateColumns={gridTemplateColumns}
                            actions={
                                isFunction(getActionsConfig) ? (
                                    <Dropdown
                                        options={getActionsConfig(item).map(({ label, action }) => ({
                                            label,
                                            onClick: () => action(item)
                                        }))}
                                    />
                                ) : null
                            }
                            onRowClick={onRowClick ? () => onRowClick(item) : undefined}
                        />
                    )
                )}

                {/* Loading trigger for intersection observer */}
                {hasMore && (
                    <div ref={loadingTriggerRef} className={styles.loadingTrigger} style={{ height: '20px', margin: '10px 0' }}>
                        {showInlineLoader && <div className={styles.inlineLoader} />}
                    </div>
                )}
            </div>

            {showPagination && data.length && (
                <Pagination loadedItems={data.length} totalItems={totalItems} className={styles.pagination} />
            )}
        </>
    );
};

export default Table;

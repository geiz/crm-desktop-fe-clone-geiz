import Cell from './Cell';
import cn from 'classnames';

import { TableCellProps } from 'components/Table/types';

import styles from './TableRow.module.css';

interface Props {
    cells: TableCellProps[];
    gridTemplateColumns: string;
    actions?: React.ReactNode;
    onRowClick?: () => void;
}

const TableRow = ({ cells, gridTemplateColumns, actions, onRowClick }: Props) => {
    return (
        <div
            style={{ gridTemplateColumns }}
            className={cn(styles.row, { [styles.clickable]: onRowClick }, 'table-row')}
            onClick={onRowClick}>
            {cells.map(cell => (
                <Cell key={cell.key} cell={cell} />
            ))}
            {actions && <div className={cn(styles.cell, styles.actions)}>{actions}</div>}
        </div>
    );
};

export default TableRow;

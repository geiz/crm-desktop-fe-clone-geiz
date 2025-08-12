import CustomCell from './CustomCell';
import cn from 'classnames';

import { formatValue } from 'components/Table/utils';

import { PaymentCellProps } from 'types/invoiceTypes';

import styles from './Cells.module.css';

const PaymentCell = ({ rowData, cell }: PaymentCellProps) => {
    return (
        <div className={styles.cellWrapper}>
            <div
                className={cn(styles.cell, cell.typography || 'body-12SB', {
                    [styles.collapse]: cell.nowrap
                })}>
                {cell?.components ? <CustomCell rowData={rowData} cell={cell} /> : formatValue(cell)}
            </div>
        </div>
    );
};

export default PaymentCell;

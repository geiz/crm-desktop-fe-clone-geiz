import { getFirstIcon, paymentsTableColumns } from '../constants';
import PaymentCell from './Cells/PaymentCell';
import PaymentActions from './PaymentActions';
import cn from 'classnames';

import { TableCellProps } from 'components/Table/types';
import { formatCells } from 'components/Table/utils';

import { InvoicePayment } from 'types/invoiceTypes';

import styles from './PaymentTableRow.module.css';

interface PaymentTableRowProps {
    cells: TableCellProps[];
    rowData: InvoicePayment;
    gridTemplateColumns: string;
    children?: React.ReactNode;
}

const PaymentTableRow = ({ gridTemplateColumns, cells, rowData }: PaymentTableRowProps) => {
    return (
        <>
            <PaymentRow rowData={rowData} gridTemplateColumns={gridTemplateColumns} cells={cells} />

            {rowData.refunds &&
                rowData.refunds.map((item, i) => {
                    const firstIcon = getFirstIcon(rowData);
                    const isExtended = firstIcon.includes('extended');

                    return (
                        <PaymentRow
                            key={item.id}
                            rowData={item}
                            gridTemplateColumns={gridTemplateColumns}
                            cells={formatCells(item, paymentsTableColumns)}>
                            <i
                                className={cn(`icomoon ${i === 0 ? firstIcon : 'icon-secondary-arrow'}`, styles.arrowIcon, {
                                    [styles.extendedArrow]: i === 0 && isExtended,
                                    [styles.baseArrow]: (i === 0 && !isExtended) || i > 0
                                })}
                            />
                        </PaymentRow>
                    );
                })}
        </>
    );
};

export default PaymentTableRow;

const PaymentRow = ({ gridTemplateColumns, children, cells, rowData }: PaymentTableRowProps) => {
    return (
        <div style={{ gridTemplateColumns }} className={cn(styles.row, 'table-row')}>
            {children}
            {cells.map(cell => (
                <PaymentCell key={cell.key} rowData={rowData} cell={cell} />
            ))}
            {!rowData.parentId && <PaymentActions rowData={rowData} />}
        </div>
    );
};

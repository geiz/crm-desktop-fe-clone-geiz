import AmountCellForm from './AmountCellForm';
import cn from 'classnames';

import { TableCellProps } from 'components/Table/types';
import { formatValue } from 'components/Table/utils';
import Popover from 'components/ui/Popover';

import useUpdatePayment from 'hooks/useUpdatePayment';
import { InvoicePayment } from 'types/invoiceTypes';

import styles from './Cells.module.css';

interface AmountCellProps {
    cell: TableCellProps;
    rowData: InvoicePayment;
}

const AmountCell = ({ cell, rowData }: AmountCellProps) => {
    const { isLoading, handleUpdatePayment } = useUpdatePayment(rowData);

    return (
        <Popover
            tooltipText='Edit amount'
            childrenStyle={cn(styles.ellipsis)}
            className={styles.popover}
            popoverContent={<AmountCellForm onSubmit={handleUpdatePayment} isLoading={isLoading} defaultValue={cell.value as number} />}>
            {formatValue(cell)}
        </Popover>
    );
};

export default AmountCell;

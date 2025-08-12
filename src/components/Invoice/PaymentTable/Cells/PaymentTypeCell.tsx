import PaymentTypeCellForm from './PaymentTypeCellForm';
import cn from 'classnames';

import { getPaymentTypeName } from 'components/Invoice/constants';
import { TableCellProps } from 'components/Table/types';
import { formatValue } from 'components/Table/utils';
import Button from 'components/ui/Button';
import Popover from 'components/ui/Popover';

import useTableCellPopover from 'hooks/useTableCellPopover';
import useUpdatePayment from 'hooks/useUpdatePayment';
import { InvoicePayment } from 'types/invoiceTypes';

import styles from './Cells.module.css';

interface PaymentTypeCellProps {
    rowData: InvoicePayment;
    cell: TableCellProps;
    isEditable: boolean;
}

const PaymentTypeCell: React.FC<PaymentTypeCellProps> = ({ rowData, cell, isEditable }) => {
    const { isEdit, closeEditPopover, openEditPopover } = useTableCellPopover();
    const { isLoading, handleUpdatePayment } = useUpdatePayment(rowData, closeEditPopover);

    const isTransferPayment = Boolean(rowData.referenceNumber);
    const isCheckPayment = Boolean(rowData.checkNumber);

    const getKey = () => {
        if (isCheckPayment) return 'checkNumber';
        else if (isTransferPayment) return 'referenceNumber';
        return '';
    };

    const valueToEdit = rowData.referenceNumber || rowData.checkNumber;

    return (
        <Popover
            tooltipText='Click to see more'
            childrenStyle={cn(styles.ellipsis)}
            onClose={closeEditPopover}
            className={styles.popover}
            popoverContent={
                <>
                    {isEdit ? (
                        <PaymentTypeCellForm
                            onSubmit={handleUpdatePayment}
                            label={`Edit ${getPaymentTypeName(rowData.type)} number`}
                            defaultValues={{ [getKey()]: valueToEdit }}
                            isLoading={isLoading}
                        />
                    ) : (
                        <div className={cn(styles.popoverChildren, styles.itemsCenter)}>
                            <p className={cn('body-14M', styles.grey800)}>{valueToEdit}</p>
                            {getKey() && isEditable && (
                                <Button
                                    icon='edit'
                                    area-label='edit'
                                    btnStyle='icon-btn'
                                    className={styles.editBtn}
                                    onClick={openEditPopover}
                                />
                            )}
                        </div>
                    )}
                </>
            }>
            {formatValue(cell)}
            <div className={styles.ellipsis}>{valueToEdit}</div>
        </Popover>
    );
};

export default PaymentTypeCell;

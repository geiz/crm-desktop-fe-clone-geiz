import NoteForm from './NoteForm';
import cn from 'classnames';

import { TableCellProps } from 'components/Table/types';
import Button from 'components/ui/Button';
import Popover from 'components/ui/Popover';

import useTableCellPopover from 'hooks/useTableCellPopover';
import useUpdatePayment from 'hooks/useUpdatePayment';
import { InvoicePayment } from 'types/invoiceTypes';

import styles from './Cells.module.css';

interface NoteCellProps {
    cell: TableCellProps;
    rowData: InvoicePayment;
    isEditable: boolean;
}

const NoteCell: React.FC<NoteCellProps> = ({ cell, rowData, isEditable }) => {
    const { isEdit, openEditPopover, closeEditPopover } = useTableCellPopover();
    const { handleUpdatePayment, isLoading } = useUpdatePayment(rowData, closeEditPopover);

    const value = String(cell.value);
    const shouldShowPopover = isEditable || value.length > 15;

    if (!shouldShowPopover) return value || '-';

    if (cell.value) {
        return (
            <Popover
                tooltipText='Click to see more'
                placement='autoVerticalStart'
                childrenStyle={cn(styles.ellipsis, 'body-14M')}
                onClose={closeEditPopover}
                className={styles.popover}
                popoverContent={
                    isEdit ? (
                        <NoteForm onSubmit={handleUpdatePayment} isLoading={isLoading} defaultValue={value} />
                    ) : (
                        <div className={styles.popoverChildren}>
                            <p className={cn('break-word body-14M', styles.text)}>{value}</p>
                            {isEditable && (
                                <Button
                                    icon='edit'
                                    area-label='edit'
                                    btnStyle='icon-btn'
                                    className={styles.editBtn}
                                    onClick={openEditPopover}
                                />
                            )}
                        </div>
                    )
                }>
                {cell.value}
            </Popover>
        );
    }

    // empty but editable
    return (
        <Popover
            className={styles.popover}
            tooltipText='Add note'
            popoverContent={<NoteForm onSubmit={handleUpdatePayment} isLoading={isLoading} defaultValue={cell.value as string} />}>
            <div className={styles.noNote}>
                <i className={cn(styles.icon, 'icon-plus-square')}></i>
                Note
            </div>
        </Popover>
    );
};

export default NoteCell;

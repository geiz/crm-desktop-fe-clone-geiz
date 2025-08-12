import AmountCell from './AmountCell';
import FileCell from './FileCell';
import NoteCell from './NoteCell';
import PaymentTypeCell from './PaymentTypeCell';

import { formatValue } from 'components/Table/utils';

import { INVOICE_PAYMENT_TYPE, PaymentCellProps } from 'types/invoiceTypes';

const CustomCell = ({ rowData, cell }: PaymentCellProps) => {
    // 1. Можливість редагувати є в наступних методах оплати: check / cash / e-transfer
    // 5. Редагувати можемо тільки пейменти (рефанди редагувати не можемо) в яких не було рефандів
    const isEditablePayment = rowData?.refunds?.length === 0 && rowData.type !== INVOICE_PAYMENT_TYPE.CREDIT_CARD;

    const cellComponents: { [key: string]: () => React.ReactNode } = {
        type: () => {
            if (rowData.type === INVOICE_PAYMENT_TYPE.E_TRANSFER || rowData.type === INVOICE_PAYMENT_TYPE.CHECK)
                return <PaymentTypeCell cell={cell} rowData={rowData} isEditable={isEditablePayment} />;
            else return formatValue(cell);
        },
        amount: () => {
            if (isEditablePayment) return <AmountCell cell={cell} rowData={rowData} />;
            else return formatValue(cell);
        },
        note: () => <NoteCell cell={cell} rowData={rowData} isEditable={isEditablePayment} />,
        file: () => <FileCell rowData={rowData} />
    };

    // for parent payment rows
    if (!rowData.parentId) return cellComponents[cell.key]();

    // all row notes included refund rows
    if (cell.key === 'note') return <NoteCell cell={cell} rowData={rowData} isEditable={false} />;

    // rest refund cells
    return formatValue(cell);
};

export default CustomCell;

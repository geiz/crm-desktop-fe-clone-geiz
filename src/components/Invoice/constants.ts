import { TableCellColumn, TableCellValue } from 'components/Table/types';

import {
    ONLY_DIGITS,
    ONLY_DIGITS_PATTERN,
    REQUIRED_FIELD,
    UPPERCASE_AND_DIGITS,
    UPPERCASE_AND_DIGITS_PATTERN
    // ZIP_CODE_PATTERN // avalon
} from 'constants/common';
import { INVOICE_PAYMENT_STATUS, INVOICE_PAYMENT_TYPE, InvoicePayment, PaymentTabsData } from 'types/invoiceTypes';

export const getPaymentTypeName = (type: TableCellValue) => {
    switch (type) {
        case INVOICE_PAYMENT_TYPE.CREDIT_CARD:
            return 'Card';
        case INVOICE_PAYMENT_TYPE.CASH:
            return 'Cash';
        case INVOICE_PAYMENT_TYPE.CHECK:
            return 'Check';
        case INVOICE_PAYMENT_TYPE.E_TRANSFER:
            return 'E-Transfer';
        case INVOICE_PAYMENT_TYPE.REFUND:
            return 'Refund';
        case INVOICE_PAYMENT_TYPE.OTHER:
            return 'Other';
        default:
            return `${type}`;
    }
};

export const getPaymentStatusName = (status: TableCellValue) => {
    switch (status) {
        case INVOICE_PAYMENT_STATUS.PENDING:
            return 'Pending';
        case INVOICE_PAYMENT_STATUS.PAID:
            return 'Paid';
        case INVOICE_PAYMENT_STATUS.FAILED:
            return 'Failed';
        default:
            return '';
    }
};

export const paymentsTableColumns: TableCellColumn[] = [
    {
        key: 'paidAt',
        label: 'Date',
        typography: 'body-14M',
        format: 'date'
    },
    {
        key: 'type',
        label: 'Type',
        handleValue: getPaymentTypeName,
        typography: 'body-14M',
        components: true
    },
    {
        key: 'status',
        label: 'Status',
        handleValue: getPaymentStatusName,
        typography: 'body-14M'
    },
    {
        key: 'amount',
        label: 'Amount',
        format: 'price',
        typography: 'body-14M',
        components: true
    },
    {
        key: 'note',
        label: 'Payment Notes',
        typography: 'body-14M',
        components: true,
        nowrap: true
    },
    {
        key: 'file',
        label: 'Files',
        components: true
    }
];

export const paymentTabsData: PaymentTabsData[] = [
    {
        name: 'Card',
        disabled: false,
        input: null
        // avalone
        // input: {
        //     name: 'zipCode',
        //     label: 'Postal code',
        //     placeholder: 'Enter postal code',
        //     rules: {
        //         required: REQUIRED_FIELD,
        //         validate: value =>
        //             ZIP_CODE_PATTERN.test(value as string) || POSTAL_CODE_PATTERN.test(value as string) || 'Incorrect zip/postal code'
        //     }
        // }
    },
    {
        name: 'Check',
        disabled: false,
        input: {
            name: 'checkNumber',
            label: 'Check number',
            placeholder: 'Enter check number',
            rules: {
                required: REQUIRED_FIELD,
                maxLength: { value: 20, message: 'Max length is 20 characters' },
                pattern: {
                    value: ONLY_DIGITS_PATTERN,
                    message: ONLY_DIGITS
                }
            }
        }
    },
    { name: 'Cash', disabled: false, input: null },
    {
        name: 'e-Transfer',
        disabled: false,
        input: {
            name: 'referenceNumber',
            label: 'Reference number',
            placeholder: 'Enter reference number',
            rules: {
                required: REQUIRED_FIELD,
                maxLength: { value: 20, message: 'Max length is 20 characters' },
                pattern: {
                    value: UPPERCASE_AND_DIGITS_PATTERN,
                    message: UPPERCASE_AND_DIGITS
                }
            }
        }
    },
    { name: 'Other', disabled: false, input: null }
];

export const getMaxRefund = (selectedPayment: InvoicePayment) => {
    if (!selectedPayment) return 0;

    const totalRefunded = selectedPayment.refunds?.reduce((acc, el) => acc - el.amount, 0);

    return totalRefunded ? selectedPayment.amount - Math.max(totalRefunded, 0) : selectedPayment.amount;
};

export const paymentsTemplateColumns = '9.2rem 12rem 7rem 9.6rem 12rem 5.5rem';

export const getFirstIcon = (rowData: InvoicePayment) =>
    rowData.type === INVOICE_PAYMENT_TYPE.CHECK || rowData.type === INVOICE_PAYMENT_TYPE.E_TRANSFER
        ? 'icon-extended-arrow'
        : 'icon-primary-arrow';

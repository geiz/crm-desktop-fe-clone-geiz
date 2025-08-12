import PaymentTableRow from './PaymentTable/PaymentTableRow';
import cn from 'classnames';

import { useMemo } from 'react';

import Block from 'components/Block/Block';
import { paymentsTableColumns, paymentsTemplateColumns } from 'components/Invoice/constants';
import Table from 'components/Table/Table';
import { ComponentsProps } from 'components/Table/types';
import { formatCells } from 'components/Table/utils';

import { InvoicePayment } from 'types/invoiceTypes';

import styles from './InvoicePayments.module.css';

interface InvoicePaymentsProps {
    list: InvoicePayment[];
}

export const InvoicePayments = ({ list }: InvoicePaymentsProps) => {
    const components = useMemo(
        () => ({
            Row: ({ rowData }: ComponentsProps<InvoicePayment>) => {
                return (
                    <PaymentTableRow
                        rowData={rowData}
                        cells={formatCells(rowData, paymentsTableColumns)}
                        gridTemplateColumns={paymentsTemplateColumns}
                    />
                );
            }
        }),
        []
    );

    return (
        <Block className={styles.block}>
            <p className={cn('h-16B', styles.title)}>Payments</p>
            <div className={styles.tableWrapper}>
                <Table columns={paymentsTableColumns} data={list} gridTemplateColumns={paymentsTemplateColumns} components={components} />
            </div>
        </Block>
    );
};

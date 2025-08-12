import cn from 'classnames';
import dayjs from 'dayjs';

import { getPaymentStatusName, getPaymentTypeName } from 'components/Invoice/constants';

import { DATE_ALPHABETICAL } from 'constants/common';
import { InvoicePayment } from 'types/invoiceTypes';
import formatPriceValue from 'utils/formatPriceValue';

import styles from './InvoicePreviewPayments.module.css';

type Props = {
    payments: InvoicePayment[];
};

const InvoicePreviewPayments = ({ payments }: Props) => {
    return (
        <div className={styles.container}>
            <div className={cn(styles.title, 'h-16B')}>Payments</div>
            {payments.map((payment, index) => (
                <div key={index} className={cn(styles.payment, 'body-14M')}>
                    <div>{dayjs.unix(payment.paidAt).format(DATE_ALPHABETICAL)}</div>
                    <div>{getPaymentTypeName(payment.type)}</div>
                    <div>{getPaymentStatusName(payment.status)}</div>
                    <div>{formatPriceValue(payment.amount)}</div>
                    {payment.signatureBase64 && <img className={styles.signature} src={payment.signatureBase64} alt='Client signature' />}
                </div>
            ))}
        </div>
    );
};

export default InvoicePreviewPayments;

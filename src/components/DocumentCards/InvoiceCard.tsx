import cn from 'classnames';

import { Link } from 'react-router-dom';

import Block from 'components/Block/Block';

import { APP_ROUTES } from 'constants/routes';
import { parametrizeRouterURL } from 'routes/utils';
import { InvoiceCardItem } from 'types/invoiceTypes';
import formatIdTo8digits from 'utils/formatIdTo8digits';

import styles from './InvoiceCard.module.css';

type InvoiceCardProps = {
    invoice: InvoiceCardItem;
    jobId: string;
    className?: string;
};

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, jobId, className }) => {
    return (
        <Block className={cn(styles.card, className)}>
            <span className={cn(styles.title, 'h-16B')}>Invoice</span>
            <span className={cn(styles.label, 'body-14M')}>ID:</span>
            <span className={cn(styles.value, 'body-14M')}>
                {/*TODO: remove temporary crutch */}
                <Link
                    to={parametrizeRouterURL(APP_ROUTES.jobs.invoiceItem, {
                        jobId: `${jobId}`
                    })}
                    className='link-underline'>
                    {formatIdTo8digits(invoice.id)}
                </Link>
            </span>
            <span className={cn(styles.label, 'body-14M')}>Total:</span>
            <span className={cn(styles.value, 'body-14M')}>${invoice.total}</span>
            <span className={cn(styles.label, 'body-14M')}>Paid:</span>
            <span className={cn(styles.value, 'body-14M')}>${invoice.amountPaid || 0}</span>
            <span className={cn(styles.label, 'body-14M')}>Outstanding Balance:</span>
            <span className={cn(styles.value, 'body-14M')}>${invoice.balance}</span>
        </Block>
    );
};

export default InvoiceCard;

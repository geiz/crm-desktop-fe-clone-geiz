import cn from 'classnames';

import { Link } from 'react-router-dom';

import Block from 'components/Block/Block';

import { APP_ROUTES } from 'constants/routes';
import { parametrizeRouterURL } from 'routes/utils';
import { EstimateCardItem } from 'types/estimateTypes';
import { capitalizeFirst } from 'utils/capitalizeFirst';
import formatIdTo8digits from 'utils/formatIdTo8digits';

import styles from './EstimatesCard.module.css';

type EstimatesCardProps = {
    items: EstimateCardItem[];
    className?: string;
};

const EstimatesCard: React.FC<EstimatesCardProps> = ({ items, className }) => {
    return (
        <Block className={cn(styles.card, className)}>
            <h3 className={cn(styles.title, 'h-16B')}>
                Estimates <span className={cn(styles.count, 'body-16M')}>({items.length})</span>
            </h3>

            <div className={cn(styles.grid, 'body-14M')}>
                <div className={styles.row}>
                    <span>ID</span>
                    <span>Status</span>
                    <span>Service Name</span>
                    <span>Total</span>
                </div>

                {items.map(item => (
                    <div key={item.id} className={styles.row}>
                        <Link
                            to={parametrizeRouterURL(APP_ROUTES.estimates.item, {
                                id: `${item.id}`
                            })}
                            className='link-underline'>
                            {formatIdTo8digits(item?.id)}
                        </Link>
                        <span>{capitalizeFirst(item.status)}</span>
                        <span>{item.serviceName}</span>
                        <span>$ {item.total}</span>
                    </div>
                ))}
            </div>
        </Block>
    );
};

export default EstimatesCard;

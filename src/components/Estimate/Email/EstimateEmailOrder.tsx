import cn from 'classnames';
import { isFunction } from 'lodash';

import { memo } from 'react';

import Dropdown from 'components/ui/Dropdown';

import { EstimateEmailResponseOrderInfo } from 'types/estimateTypes';

import styles from './EstimateEmailOrder.module.css';

interface Props {
    orderType: string;
    list: EstimateEmailResponseOrderInfo[];
    onEdit?: (id: number | string) => void;
    onDelete?: (id: number | string) => void;
}

const EstimateEmailOrder = memo(({ orderType, list, onEdit, onDelete }: Props) => (
    <div>
        <div className={cn(styles.header, { [styles.editMode]: isFunction(onEdit) })}>
            <span className={cn('body-14M', styles.headerTitle, styles.description)}>{orderType}</span>
            <span className={cn('body-14M', styles.headerTitle, styles.quantity)}>QTY</span>
            <span className={cn('body-14M', styles.headerTitle, styles.unitPrice, { [styles.editMode]: isFunction(onEdit) })}>
                UNIT PRICE
            </span>
            {isFunction(onEdit) && <span className={cn('body-14M', styles.headerTitle, styles.actions)} />}
        </div>
        <div>
            {list.map((item, index) => (
                <div key={index} className={cn(styles.listItem, { [styles.editMode]: isFunction(onEdit) })}>
                    <div className={cn(styles.description, styles.fullDescription)}>
                        <p className={cn('h-16B', styles.mainInfo)}>{item.name}</p>
                        <p className={cn('body-14M', styles.summary)}>{item.summary}</p>
                    </div>
                    <div className={styles.quantity}>
                        <p className={cn('h-16B', styles.mainInfo)}>{item.quantity}</p>
                    </div>
                    <div className={cn(styles.unitPrice, { [styles.editMode]: isFunction(onEdit) })}>
                        <p className={cn('h-16B', styles.mainInfo)}>${Number(item.price.toFixed(2)).toLocaleString('en-IN')}</p>
                    </div>
                    {isFunction(onEdit) && (
                        <div className={styles.actions}>
                            <Dropdown
                                options={[
                                    { label: 'Edit', onClick: () => onEdit?.(item.id) },
                                    { label: 'Delete', onClick: () => onDelete?.(item.id) }
                                ]}
                                className={styles.actionsDropdown}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
));

export default EstimateEmailOrder;

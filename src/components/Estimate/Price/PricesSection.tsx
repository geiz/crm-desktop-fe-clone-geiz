import cn from 'classnames';
import { Loader } from 'rsuite';

import { useCallback, useState } from 'react';

import Select from 'components/ui/Input/Select';

import { ItemPrices, TaxOption } from 'types/estimateTypes';

import styles from './EstimatePrice.module.css';

interface Props {
    canEdit: boolean;
    prices: ItemPrices;
    taxOptions: TaxOption[];
    onTaxChange: (id: number) => Promise<void>;
    children: React.ReactNode;
}

const PricesSection = ({ prices, taxOptions, canEdit, onTaxChange, children }: Props) => {
    const [isPricesLoading, setIsPricesLoading] = useState(false);

    const handleTaxSelect = useCallback(
        (option: unknown) => {
            setIsPricesLoading(true);
            onTaxChange((option as TaxOption).id).finally(() => setIsPricesLoading(false));
        },
        [onTaxChange]
    );

    const getOptionValue = useCallback((option: unknown) => `${(option as TaxOption)['id']}`, []);
    const getOptionLabel = useCallback((option: unknown) => `${(option as TaxOption).name} (${(option as TaxOption).ratePercent}%)`, []);

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.flexBlock}>
                    <p className={cn('body-14M', styles.title)}>Subtotal</p>
                    <p className={cn('body-14M', styles.price)}>${(prices?.subTotal || 0).toFixed(2)}</p>
                </div>
            </div>
            <div className={styles.section}>{children}</div>
            <div className={styles.section}>
                <div className={styles.flexBlock}>
                    {canEdit ? (
                        <Select
                            label='Tax Rate'
                            options={taxOptions}
                            value={prices?.tax?.rate}
                            getOptionValue={getOptionValue}
                            getOptionLabel={getOptionLabel}
                            onChange={handleTaxSelect}
                            placeholder='Select tax rate'
                        />
                    ) : (
                        <p className={cn('body-14M', styles.title)}>
                            Tax ({(prices.tax?.rate as TaxOption)?.name} {(prices.tax?.rate as TaxOption)?.ratePercent}%)
                        </p>
                    )}
                    <p className={cn('body-14M', styles.price, { [styles.taxPrice]: canEdit })}>${(prices?.tax?.value || 0).toFixed(2)}</p>
                </div>
            </div>
            <div className={styles.flexBlock}>
                <p className={cn('h-16B', styles.title)}>Total</p>
                <p className={cn('h-16B', styles.price)}>${(prices?.total || 0).toFixed(2)}</p>
            </div>
            {isPricesLoading && <Loader center size='md' />}
        </div>
    );
};

export default PricesSection;

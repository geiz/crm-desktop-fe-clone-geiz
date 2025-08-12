import cn from 'classnames';

import { FormEventHandler, useCallback, useMemo, useState } from 'react';

import Button from 'components/ui/Button';
import { Input, Textarea } from 'components/ui/Input';
import Select from 'components/ui/Input/Select';

import { LENGTH_M } from 'constants/common';
import { EstimateMaterial, EstimateService, ServiceOption } from 'types/estimateTypes';

import styles from './InvoiceSettingsForm.module.css';

interface Props<T> {
    itemData: T;
    options: ServiceOption[];
    onChange: (material: T) => Promise<void>;
    onClose: () => void;
}

const InvoiceSettingsForm = <T extends EstimateMaterial | EstimateService>({ itemData, options, onChange, onClose }: Props<T>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState(itemData);
    const [unitPriceError, setUnitPriceError] = useState('');

    const hasPartNumber = useMemo(() => (form as EstimateMaterial).partNumber !== undefined, [form]);

    const handleNameChange = (option: unknown) => {
        const { price, summary } = option as ServiceOption;
        setForm(prevstate => ({
            ...prevstate,
            itemName: option as ServiceOption,
            price: price || prevstate.price,
            summary: summary || ''
        }));
    };

    const handleQuantityChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const value = +target.value;
        if (!Number.isInteger(value) || value <= 0) return;
        setForm(prevState => ({ ...prevState, quantity: value }));
    };

    const handleUnitPriceChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const value = +target.value;
        if (value < 0.01) {
            setUnitPriceError('Must be at least 0.01');
        } else {
            setUnitPriceError('');
            setForm(prevState => ({ ...prevState, price: value }));
        }
    };

    const handleSummaryChange = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm(prevState => ({ ...prevState, summary: target.value }));
    };

    const handlePartNumberChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prevState => ({ ...prevState, partNumber: target.value }));
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
        event.preventDefault();
        setIsLoading(true);
        onChange(form).finally(() => setIsLoading(false));
    };

    const getOptionValue = useCallback((option: unknown) => `${(option as ServiceOption)['id']}`, []);
    const getOptionLabel = useCallback((option: unknown) => (option as ServiceOption).name, []);

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={cn(styles.title, 'h-16B')}>Edit Item</div>
            <div className={styles.row}>
                <Select
                    label='Item Name'
                    options={options}
                    placeholder='Select Item'
                    value={form.itemName}
                    getOptionValue={getOptionValue}
                    getOptionLabel={getOptionLabel}
                    onChange={handleNameChange}
                    className={styles.itemNameSelect}
                />
                <Input
                    label='Unit Price'
                    type='number'
                    name='price'
                    step='0.01'
                    startIcon={<span className={cn('body-16R', styles.currency)}>$</span>}
                    className={styles.priceInput}
                    value={form.price.toString()}
                    min={0}
                    onChange={handleUnitPriceChange}
                    errorMessage={unitPriceError}
                    disabled={!form.itemName}
                />
                <Input
                    label='Qty'
                    type='number'
                    name='quantity'
                    className={styles.quantityInput}
                    value={form.quantity.toString()}
                    min={1}
                    onChange={handleQuantityChange}
                    disabled={!form.itemName}
                />
            </div>
            <div className={styles.row}>
                <Textarea
                    label='Summary*'
                    placeholder='Enter description'
                    maxLength={LENGTH_M}
                    value={form.summary}
                    height={19}
                    onChange={handleSummaryChange}
                    disabled={!form.itemName}
                    className={cn({
                        [styles.serviceSummary]: !hasPartNumber,
                        [styles.materialSummary]: hasPartNumber
                    })}
                />
                {hasPartNumber && (
                    <Input
                        label='Part number'
                        name='partNumber'
                        placeholder='Enter part number'
                        className={styles.partNumberInput}
                        maxLength={15}
                        value={(form as EstimateMaterial).partNumber}
                        onChange={handlePartNumberChange}
                        disabled={!form.itemName}
                    />
                )}
            </div>
            <div className={styles.actions}>
                <Button onClick={onClose} type='button' btnStyle='text-btn-m'>
                    Cancel
                </Button>
                <Button btnStyle='blue-m' type='submit' isLoading={isLoading}>
                    Save
                </Button>
            </div>
        </form>
    );
};

export default InvoiceSettingsForm;

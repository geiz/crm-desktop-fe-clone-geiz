import cn from 'classnames';
import Loader from 'rsuite/esm/Loader';

import { JSX, useCallback, useEffect, useState } from 'react';

import Button from 'components/ui/Button';
import { Input, Select, Textarea } from 'components/ui/Input';

import { LENGTH_M } from 'constants/common';
import { EstimateMaterial, EstimateService, ServiceOption } from 'types/estimateTypes';

import styles from './EstimateFormItem.module.css';

import 'rsuite/Loader/styles/index.css';

interface Props<T> {
    itemData: T;
    isUpdating?: boolean;
    status?: 'saved' | 'unsaved' | '';
    options: ServiceOption[];
    onChange: (material: T) => void;
    onDelete: (id: number) => Promise<boolean>;
}

const EstimateFormItem = <T extends EstimateMaterial | EstimateService>({
    isUpdating,
    itemData,
    status = '',
    options,
    onChange,
    onDelete
}: Props<T>) => {
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [form, setForm] = useState(itemData);
    const [unitPriceError, setUnitPriceError] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState<JSX.Element | null>(null);
    const hasPartNumber = (form as EstimateMaterial).partNumber !== undefined;

    useEffect(() => {
        if (status) {
            setMessage(
                status === 'unsaved' ? (
                    <>
                        <i className='icon-refresh' /> Unsaved
                    </>
                ) : (
                    <>Saved</>
                )
            );
            setIsVisible(true);
        } else if (isVisible) {
            const fadeOutTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(fadeOutTimeout);
        }
    }, [status, isVisible]);

    const startChangeItem = (form: T) => {
        setForm(form);
        onChange(form);
    };

    const handleNameChange = (option: unknown) => {
        const { price, summary } = option as ServiceOption;
        const updatedForm = {
            ...form,
            itemName: option as ServiceOption,
            price: price || form.price,
            summary: summary || ''
        };
        startChangeItem(updatedForm);
    };

    const handleQuantityChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const value = +target.value;
        if (!Number.isInteger(value) || value <= 0) return;
        const updatedForm = { ...form, quantity: value };
        startChangeItem(updatedForm);
    };

    const handleUnitPriceChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const updatedForm = { ...form, price: +target.value };
        startChangeItem(updatedForm);
    };

    const handleSummaryChange = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedForm = { ...form, summary: target.value };
        setForm(updatedForm);
        startChangeItem(updatedForm);
    };

    const handlePartNumberChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const updatedForm = { ...form, partNumber: target.value };
        setForm(updatedForm);
        startChangeItem(updatedForm);
    };

    const handleDelete = () => {
        setIsDeleteLoading(true);
        onDelete(itemData.id).finally(() => setIsDeleteLoading(false));
    };

    const getOptionValue = useCallback((option: unknown) => `${(option as ServiceOption)['id']}`, []);
    const getOptionLabel = useCallback((option: unknown) => (option as ServiceOption).name, []);

    return (
        <div className={styles.container}>
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
                    label='Qty'
                    type='number'
                    name='quantity'
                    className={styles.quantityInput}
                    value={form.quantity.toString()}
                    min={1}
                    onChange={handleQuantityChange}
                    disabled={!form.itemName}
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
                <Button icon='trash' btnStyle='outlined-s' className={styles.deleteBtn} onClick={handleDelete} />
            </div>
            <div className={styles.row}>
                <Textarea
                    label='Summary*'
                    placeholder='Enter description'
                    maxLength={LENGTH_M}
                    value={form.summary}
                    onChange={handleSummaryChange}
                    disabled={!form.itemName}
                    autoResize
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
            {isDeleteLoading && <Loader backdrop center size='md' />}
            {isUpdating && (
                <div className={styles.loaderWrapper}>
                    <Loader />
                </div>
            )}
            <div className={cn('body-14M', styles.statusMessage, { [styles.statusMessageVisible]: isVisible })}>{message}</div>
        </div>
    );
};

export default EstimateFormItem;

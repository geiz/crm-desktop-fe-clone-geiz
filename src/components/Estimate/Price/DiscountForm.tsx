import { initialFormData, radioBtns } from './constants';
import cn from 'classnames';

import { Controller, useForm } from 'react-hook-form';

import Button from 'components/ui/Button';
import { Input } from 'components/ui/Input';
import Radio from 'components/ui/Input/Radio';

import { REQUIRED_FIELD } from 'constants/common';
import { DISCOUNT_TYPE, DiscountFormValues } from 'types/estimateTypes';

import styles from './DiscountForm.module.css';

interface Props {
    title: string;
    isLoading: boolean;
    values?: DiscountFormValues;
    onSubmit: (formData: DiscountFormValues) => void;
    onClose: () => void;
}

const rules = { required: REQUIRED_FIELD };

const DiscountForm = ({ title, values = initialFormData, isLoading, onSubmit, onClose }: Props) => {
    const { control, handleSubmit, watch } = useForm({
        defaultValues: values
    });

    const watchType = watch('type');

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={cn(styles.title, 'h-16B')}>{title}</div>
            <p className={cn(styles.subTitle, 'body-14M')}>You can only apply one type of discount at a time.</p>
            <div className={styles.inputs}>
                <Controller
                    name='type'
                    control={control}
                    render={({ field }) => (
                        <div className={styles.radioGroup}>
                            {radioBtns.map(el => (
                                <Radio
                                    key={el.value}
                                    id={String(el.value)}
                                    value={el.value}
                                    label={el.label}
                                    checked={field.value === el.value}
                                    onChange={() => field.onChange(el.value)}
                                />
                            ))}
                        </div>
                    )}
                />
                <div className={styles.inputsRow}>
                    <Controller
                        name='amount'
                        control={control}
                        rules={rules}
                        render={({ field: { value, onChange } }) => (
                            <Input
                                label='Discount*'
                                type='number'
                                required
                                startIcon={
                                    <span className={cn('body-16R', styles.currency)}>
                                        {watchType === DISCOUNT_TYPE.PERCENTAGE ? '%' : '$'}
                                    </span>
                                }
                                step='0.1'
                                min={0}
                                value={value}
                                className={styles.discountInput}
                                onChange={onChange}
                            />
                        )}
                    />
                    <Controller
                        name='description'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                label='Description (Optional)'
                                placeholder='Enter Description'
                                maxLength={250}
                                className={styles.discountDescription}
                            />
                        )}
                    />
                </div>
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

export default DiscountForm;

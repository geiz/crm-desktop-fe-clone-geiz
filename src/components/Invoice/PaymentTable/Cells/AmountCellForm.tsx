import cn from 'classnames';

import { Controller, useForm } from 'react-hook-form';

import Button from 'components/ui/Button';
import { Input } from 'components/ui/Input';

import { PaymentFormValues } from 'types/invoiceTypes';
import controllNumericInput from 'utils/controllNumericInput';
import { priceRules } from 'utils/validationRules';

import styles from './Cells.module.css';

interface AmountCellFormProps {
    onSubmit: (data: Partial<PaymentFormValues>) => void;
    defaultValue: number;
    isLoading: boolean;
}

const AmountCellForm = ({ defaultValue, onSubmit, isLoading }: AmountCellFormProps) => {
    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm({ defaultValues: { amount: defaultValue }, mode: 'onChange' });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('body-14M', styles.popoverChildren, styles.form)}>
            <Controller
                name='amount'
                control={control}
                rules={priceRules()} // maxAmount?
                render={({ field: { value, onChange } }) => (
                    <Input
                        label='Edit Amount'
                        placeholder='Enter Amount'
                        value={value ? `$${value}` : ''}
                        onChange={e => onChange(controllNumericInput(e.target.value))}
                        errorMessage={errors.amount?.message}
                    />
                )}
            />

            <Button icon='save' area-label='save' isLoading={isLoading} btnStyle='outlined-s' className={styles.saveBtn} />
        </form>
    );
};

export default AmountCellForm;

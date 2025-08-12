import cn from 'classnames';

import { Controller, useForm } from 'react-hook-form';

import { paymentTabsData } from 'components/Invoice/constants';
import Button from 'components/ui/Button';
import { Input } from 'components/ui/Input';

import { REQUIRED_FIELD } from 'constants/common';
import { PaymentFormValues } from 'types/invoiceTypes';

import styles from './Cells.module.css';

interface EditCellFormProps {
    onSubmit: (data: Partial<PaymentFormValues>) => void;
    defaultValues: Partial<PaymentFormValues>;
    label: string;
    isLoading: boolean;
}

const PaymentTypeCellForm = ({ onSubmit, defaultValues, label, isLoading }: EditCellFormProps) => {
    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm<PaymentFormValues>({ defaultValues, mode: 'onChange' });

    const inputName = Object.keys(defaultValues)[0];

    const input = paymentTabsData.find(el => el.input?.name === inputName);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('body-14M', styles.popoverChildren, styles.form)}>
            {input && input.input && (
                <Controller
                    name={input.input.name}
                    control={control}
                    rules={{
                        required: REQUIRED_FIELD,
                        ...(input.input.rules || {})
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label={label}
                            placeholder={input.input?.placeholder}
                            errorMessage={(input.input && errors?.[input.input?.name]?.message) || undefined}
                        />
                    )}
                />
            )}

            <Button icon='save' area-label='save' isLoading={isLoading} btnStyle='outlined-s' className={styles.saveBtn} />
        </form>
    );
};

export default PaymentTypeCellForm;

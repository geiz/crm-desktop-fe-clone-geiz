import cn from 'classnames';

import { useEffect } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';

import Button from 'components/ui/Button';
import { Input, Textarea } from 'components/ui/Input';
import Radio from 'components/ui/Input/Radio';

import { REQUIRED_FIELD } from 'constants/common';
import { ClientCreditCardEntity, PaymentFormInput, PaymentFormValues } from 'types/invoiceTypes';
import controllNumericInput from 'utils/controllNumericInput';
import { priceRules } from 'utils/validationRules';

import styles from './PaymentForm.module.css';

import 'overlayscrollbars/overlayscrollbars.css';

import PaymentFiles from './PaymentFiles';

interface PaymentFormProps {
    onSubmit: (data: PaymentFormValues) => void;
    input: PaymentFormInput | null;
    onClose: () => void;
    amount: number;
    //zipCode?: string;
    formTitle?: string;
    submitBtnTitle: string;
    formStyles?: string;
    isRefund?: boolean;
    isCard?: boolean;
    clientCards?: ClientCreditCardEntity[];
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    input,
    onSubmit,
    onClose,
    amount,
    isRefund,
    //zipCode,
    formTitle,
    submitBtnTitle,
    formStyles,
    isCard,
    clientCards = []
}) => {
    const {
        handleSubmit,
        control,
        reset,
        getValues,
        setValue,
        formState: { errors, isValid }
    } = useForm<PaymentFormValues>({
        defaultValues: { amount, note: '', file: null },
        mode: 'onChange'
    });

    useEffect(() => {
        const formValues = {
            amount: getValues('amount'),
            note: getValues('note'),
            file: null
        };

        if (input) reset({ ...formValues, [input.name]: '' });
        else reset(formValues);
    }, [input, reset, getValues]);

    const setFileValue = (value: Record<string, string>) => setValue('file', value);
    const removeFileValue = () => setValue('file', null);

    return (
        <form className={cn(styles.paymentForm, formStyles)} onSubmit={handleSubmit(onSubmit)}>
            {formTitle && <h3 className={cn(styles.formTitle, 'h-16B')}>{formTitle}</h3>}
            <div className={styles.formInputs}>
                <Controller
                    name='amount'
                    control={control}
                    rules={priceRules(amount)}
                    render={({ field: { value, onChange } }) => (
                        <Input
                            label='Amount'
                            placeholder='Enter Amount'
                            value={value ? `$${value}` : ''}
                            onChange={e => onChange(controllNumericInput(e.target.value))}
                            errorMessage={errors.amount?.message}
                        />
                    )}
                />

                {input && (
                    <Controller
                        key={input.name}
                        name={input.name}
                        control={control}
                        rules={{
                            required: REQUIRED_FIELD,
                            ...(input.rules || {})
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                label={input.label}
                                placeholder={input.placeholder}
                                errorMessage={(errors?.[input.name] as FieldError)?.message}
                            />
                        )}
                    />
                )}

                <Controller
                    name='note'
                    control={control}
                    render={({ field }) => (
                        <Textarea {...field} label='Payment note (Optional)' placeholder='Enter payment note' rows={3} />
                    )}
                />

                {!isRefund && !isCard && <PaymentFiles addFile={setFileValue} removeFile={removeFileValue} resetKey={input?.name} />}

                {isCard && clientCards.length > 0 && (
                    <div className={styles.notifications}>
                        <label className={cn(styles.label, 'body-12R')}>Select saved card (Optional)</label>
                        <Controller
                            name='paymentCardId'
                            control={control}
                            render={({ field }) => (
                                <div className={styles.radioGroup}>
                                    {clientCards.map(card => (
                                        <Radio
                                            key={card.id}
                                            id={card.id.toString()}
                                            value={card.id}
                                            label={`${card.brand} (Card ending in ${card.last4}) exp. ${card.expMonth}/${card.expYear}`}
                                            checked={field.value === card.id.toString()}
                                            onChange={() => field.onChange(card.id.toString())}
                                        />
                                    ))}
                                </div>
                            )}
                        />
                    </div>
                )}
            </div>

            <div className={styles.formActions}>
                <Button btnStyle='text-btn-l' type='button' onClick={onClose}>
                    Cancel
                </Button>
                <Button id='payButtonId' btnStyle='blue-l' type='submit' disabled={!isValid}>
                    {submitBtnTitle}
                </Button>
            </div>
        </form>
    );
};

export default PaymentForm;

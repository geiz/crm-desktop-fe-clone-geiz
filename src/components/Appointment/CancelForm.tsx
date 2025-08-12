import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import FormActions from 'components/Appointment/FormActions';
import { Checkbox } from 'components/ui/Input';
import Select from 'components/ui/Input/Select';
import Textarea from 'components/ui/Input/Textarea';

import { LENGTH_S, REQUIRED_FIELD } from 'constants/common';
import useSelectOptions from 'hooks/useSelectOptions';
import { SelectOption } from 'types/common';
import { CancelFormValues } from 'types/jobTypes';

import styles from './CancelForm.module.css';

interface CancelFormProps {
    closeModal: () => void;
    onSubmit: (data: CancelFormValues) => Promise<void>;
}

const CancelForm: React.FC<CancelFormProps> = ({ closeModal, onSubmit }) => {
    const { getCancelationReasons, cancelReasons } = useSelectOptions();
    const [isLoading, setIsLoading] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({ defaultValues: { cancelReasonId: null, reasonNote: '', applyCancellationFee: false }, mode: 'onChange' });

    const handleFormSubmit = (data: CancelFormValues) => {
        setIsLoading(true);
        onSubmit(data).finally(() => setIsLoading(false));
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            <Controller
                name='cancelReasonId'
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field: { name, onChange } }) => (
                    <Select
                        className={styles.cancelReason}
                        label='Reason'
                        name={name}
                        placeholder='Select a Reason'
                        options={cancelReasons.options}
                        onChange={(option: SelectOption) => onChange(option.value)}
                        onFocus={getCancelationReasons}
                        errorMessage={errors?.cancelReasonId?.message}
                        isLoading={cancelReasons.isLoading}
                    />
                )}
            />

            <Controller
                name='reasonNote'
                control={control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        label='Provide the reason for cancelling (optional)'
                        placeholder='Describe the Reason'
                        maxLength={LENGTH_S}
                        textbox={true}
                        height={7.6}
                    />
                )}
            />

            <Controller
                name='applyCancellationFee'
                control={control}
                render={({ field: { name, onChange, value } }) => (
                    <Checkbox
                        className={styles.applyCancellationFee}
                        id={name}
                        checked={Boolean(value)}
                        onChange={onChange}
                        label='Apply cancellation fee.'
                    />
                )}
            />

            <FormActions onClose={closeModal} isLoading={isLoading} />
        </form>
    );
};

export default CancelForm;

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import FormActions from 'components/Appointment/FormActions';
import { Textarea } from 'components/ui/Input';

import { LENGTH_S, REQUIRED_FIELD } from 'constants/common';

import styles from './CancelForm.module.css';

interface HoldFormProps {
    closeModal: () => void;
    onSubmit: (data: { reasonNote: string }) => Promise<void>;
}

const OnHoldForm: React.FC<HoldFormProps> = ({ closeModal, onSubmit }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({ defaultValues: { reasonNote: '' }, mode: 'onChange' });

    const handleFormSubmit = (data: { reasonNote: string }) => {
        setIsLoading(true);
        onSubmit(data).finally(() => setIsLoading(false));
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            <Controller
                name='reasonNote'
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        label='Provide the reason for placing on hold'
                        placeholder='Describe the Reason'
                        maxLength={LENGTH_S}
                        textbox
                        errorMessage={errors.reasonNote?.message}
                        height={7.6}
                    />
                )}
            />

            <FormActions onClose={closeModal} isLoading={isLoading} />
        </form>
    );
};

export default OnHoldForm;
